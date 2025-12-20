package cli

import (
	"errors"
	"fmt"
	"time"

	"github.com/fluxionwatt/gridbeat/internal/config"
	"github.com/fluxionwatt/gridbeat/internal/db"
	"github.com/fluxionwatt/gridbeat/internal/models"
	"github.com/fluxionwatt/gridbeat/internal/util"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

// resetPasswordCmd resets root password to "admin" and exits.
// resetPasswordCmd 将 root 密码重置为 "admin" 然后退出。
func resetPasswordCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "reset-password",
		Short: "Reset root password to admin / 重置 root 密码为 admin",
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := config.Load(cfgFile)
			if err != nil {
				return err
			}

			gdb, err := db.Open(cfg)
			if err != nil {
				return err
			}
			if err := models.Migrate(gdb); err != nil {
				return err
			}

			// Ensure root exists.
			// 确保 root 存在。
			if err := models.EnsureRootUser(gdb); err != nil {
				return err
			}

			var root models.User
			if err := gdb.Where("username = ?", "root").First(&root).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return fmt.Errorf("root user missing / root 用户缺失")
				}
				return err
			}

			hash, err := util.HashPassword("admin")
			if err != nil {
				return err
			}

			root.PasswordHash = hash
			root.UpdatedAt = time.Now()
			if err := gdb.Save(&root).Error; err != nil {
				return err
			}

			fmt.Println("root password reset to: admin / root 密码已重置为：admin")
			return nil
		},
	}
}
