package cmd

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/fluxionwatt/gridbeat/core"
	"github.com/fluxionwatt/gridbeat/internal/auth"
	"github.com/fluxionwatt/gridbeat/internal/db"
	"github.com/fluxionwatt/gridbeat/internal/models"
	"github.com/fluxionwatt/gridbeat/pluginapi"
	"github.com/google/uuid"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"

	_ "github.com/fluxionwatt/gridbeat/core/plugin/goose"
	_ "github.com/fluxionwatt/gridbeat/core/plugin/http"
	_ "github.com/fluxionwatt/gridbeat/core/plugin/modbusrtu"
	_ "github.com/fluxionwatt/gridbeat/core/plugin/stream"
)

func init() {
	rootCmd.AddCommand(serverCmd)

	flags := serverCmd.Flags()
	flags.BoolVar(&core.Gconfig.DisableAuth, "disable_auth", false, "disable http api auth")
}

var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "run server",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {

		cfg := &core.Gconfig

		// Enable/disable auth globally.
		// 全局启用/禁用鉴权。
		auth.NoAuth = core.Gconfig.DisableAuth

		var err error
		var logger *pluginapi.ReopenLogger

		if logger, err = pluginapi.NewReopenLogger(core.Gconfig.LogPath, core.Gconfig.Debug); err != nil {
			cobra.CheckErr(err)
			return
		}

		fmt.Printf("use log path: %s\n", core.Gconfig.LogPath)

		// 从目录加载 .so 插件工厂
		// Optional: load .so plugin factories from a directory.
		// 内置插件已经通过 init() 完成工厂注册
		// Built-in factories are already registered via init() above.
		loadSoFactories(core.Gconfig.Plugins)

		for _, f := range pluginapi.AllFactories() {
			logger.RunLogger.Info(fmt.Sprintf("factories registered %s", f.Type()))
		}

		gdb, err := db.Open(cfg, logger.SqlLogger)
		if err != nil {
			cobra.CheckErr(fmt.Errorf("db open error %w", err))
		}

		if err := models.Migrate(gdb); err != nil {
			cobra.CheckErr(fmt.Errorf("db migrate %w", err))
			return
		}

		// Build registry
		reg := models.NewRegistry()

		// 注册模型（可选：给某个模型设置默认 Preload）
		if err := reg.Register(gdb, models.Channel{} /*, modelutil.WithDefaultPreloads("Profile")*/); err != nil {
			cobra.CheckErr(fmt.Errorf("register channel %w", err))
			return
		}

		/*
			ctx := context.Background()

			// ✅ 只传 table + pkValue
			obj, err := reg.FindByTablePK(ctx, db, "users", 1)
			if err != nil {
				log.Fatal(err)
			}
			u := obj.(*example.User)
			fmt.Println("User:", u.ID, u.Name, u.Email)

			// ✅ 仍然走 Model(&T{})，可选额外 Preload / Scope（不影响你“只传 table+pkValue”）
			obj2, err := reg.FindByTablePKWith(ctx, db, "devices", int64(1),
				modelutil.WithScopes(func(tx *gorm.DB) *gorm.DB {
					return tx.Where("tag = ?", "meter")
				}),
			)
			if err != nil {
				log.Fatal(err)
			}
			d := obj2.(*example.Device)
			fmt.Println("Device:", d.ID, d.SN, d.Tag)

			// ✅ 如果你想拿到非指针的 struct 值
			val, err := reg.FindByTablePKValue(ctx, db, "users", 1)
			if err != nil {
				log.Fatal(err)
			}
			u2 := val.(example.User)
			fmt.Println("User value:", u2.ID, u2.Name)
		*/

		// Ensure root exists ("admin" password by default if created).
		// 确保 root 存在（首次创建默认密码 admin）。
		if err := models.EnsureRootUser(gdb); err != nil {
			cobra.CheckErr(fmt.Errorf("ensure root user %w", err))
			return
		}

		if err := db.SyncSerials(gdb, cfg.Serial); err != nil {
			cobra.CheckErr(fmt.Errorf("sync serials failed %w", err))
			return
		}

		// 初始化默认 setting 数据（只补缺，不覆盖）
		// Seed default settings (insert missing only, do NOT overwrite)
		if err := db.SeedDefaultSettings(gdb); err != nil {
			cobra.CheckErr(fmt.Errorf("seed default settings failed %w", err))
			return
		}

		// mqtt
		var server *mqtt.Server
		if server, err = core.ServerMQTT(logger.MqttLogger); err != nil {
			logger.MqttLogger.Error(err)
			cobra.CheckErr(fmt.Errorf("server  d mqtt %w", err))
			return
		}

		rootCtx, rootCancel := context.WithCancel(context.Background())
		defer rootCancel()

		// 捕获信号 / capture OS signals.
		go func() {
			ch := make(chan os.Signal, 1)
			signal.Notify(ch, syscall.SIGUSR1, syscall.SIGTERM, syscall.SIGINT)

			for sig := range ch {
				switch sig {
				case syscall.SIGUSR1:
					log.Println("received SIGUSR1, reopening log file")
					if err := logger.Reopen(); err != nil {
						log.Printf("reopen log failed: %v\n", err)
					}
				case syscall.SIGTERM, syscall.SIGINT:
					log.Println("exiting")
					core.RemovePidFile(core.Gconfig.PID)

					rootCancel()
					logger.Close()

					os.Exit(0)
				}
			}
		}()

		// 宿主环境 / host environment
		env := &pluginapi.HostEnv{
			Logger:    logger,
			DB:        gdb,
			MQTT:      server,
			Conf:      &core.Gconfig,
			PluginLog: logrus.NewEntry(logger.RunLogger),
		}

		// 带 rootCtx + env 的 InstanceManager
		mgr := core.NewInstanceManager(rootCtx, env)
		defer mgr.DestroyAll() // 进程退出时清理所有实例 / cleanup on shutdown

		/*
			for typ, instCfgs := range cfg.Plugins {
				for _, ic := range instCfgs {
					if ic.ID == "" {
						log.Printf("skip %s instance with empty id", typ)
						continue
					}
					log.Printf("create instance type=%s id=%s", typ, ic.ID)
					_, err := mgr.Create(typ, ic.ID, ic.Config)
					if err != nil {
						log.Printf("  create failed: %v", err)
						continue
					}
				}
			}
		*/

		if err := core.CreatePidFile(core.Gconfig.PID); err != nil {
			cobra.CheckErr(fmt.Errorf("already running? %w", err))
		}

		if err := server.Serve(); err != nil {
			logger.MqttLogger.Error(err)
			cobra.CheckErr(fmt.Errorf("server mqtt start %w", err))
			return
		}

		mgr.Create("http", uuid.New().String(), nil)
		if !core.Gconfig.HTTPS.Disable {
			mgr.Create("http", uuid.New().String(), nil)
		}

		var items []models.Serial
		if err := gdb.Order("device asc").Find(&items).Error; err != nil {
			cobra.CheckErr(fmt.Errorf("get all serial %w", err))
			return
		}
		//for _, serial := range items {
		//	mgr.Create("modbusrtu", uuid.New().String(), nil)
		//}

		select {}
	},
}
