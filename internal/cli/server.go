package cli

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/fluxionwatt/gridbeat/internal/api"
	"github.com/fluxionwatt/gridbeat/internal/auth"
	"github.com/fluxionwatt/gridbeat/internal/config"
	"github.com/fluxionwatt/gridbeat/internal/db"
	"github.com/fluxionwatt/gridbeat/internal/models"
	"github.com/gofiber/fiber/v3"
	"github.com/spf13/cobra"
)

// serverCmd starts HTTP server.
// serverCmd 启动 HTTP 服务。
func serverCmd() *cobra.Command {
	var (
		listen string
		noAuth bool
	)

	cmd := &cobra.Command{
		Use:   "server",
		Short: "Start HTTP server / 启动 HTTP 服务",
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := config.Load(cfgFile)
			if err != nil {
				return err
			}

			if listen != "" {
				cfg.Server.Listen = listen
			}

			// Enable/disable auth globally.
			// 全局启用/禁用鉴权。
			auth.NoAuth = noAuth

			gdb, err := db.Open(cfg)
			if err != nil {
				return err
			}

			if err := models.Migrate(gdb); err != nil {
				return err
			}

			// Ensure root exists ("admin" password by default if created).
			// 确保 root 存在（首次创建默认密码 admin）。
			if err := models.EnsureRootUser(gdb); err != nil {
				return err
			}

			s := api.New(gdb, cfg)
			app := s.App(fiber.New())

			// Start audit retention job.
			// 启动审计保留周期清理任务。
			stop := make(chan struct{})
			s.StartAuditRetentionJob(stop)

			// Graceful shutdown on SIGINT/SIGTERM.
			// 监听 SIGINT/SIGTERM 实现优雅退出。
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()

			go func() {
				ch := make(chan os.Signal, 2)
				signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
				<-ch
				close(stop)
				_ = app.ShutdownWithContext(ctx)
			}()

			fmt.Printf("gridbeat listening on %s (no-auth=%v)\n", cfg.Server.Listen, noAuth)
			// Fiber v3 Listen is blocking.
			// Fiber v3 的 Listen 为阻塞调用。
			if err := app.Listen(cfg.Server.Listen); err != nil {
				// Fiber returns error on Shutdown; suppress common case.
				// Fiber Shutdown 时会返回错误，这里忽略常见情况。
				select {
				case <-time.After(50 * time.Millisecond):
				default:
				}
				return err
			}
			return nil
		},
	}

	cmd.Flags().StringVar(&listen, "listen", "", "listen address (override config) / 监听地址（覆盖配置）")
	cmd.Flags().BoolVar(&noAuth, "no-auth", false, "disable auth for protected APIs (DANGEROUS) / 关闭鉴权（危险）")

	return cmd
}
