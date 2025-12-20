package db

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/fluxionwatt/gridbeat/internal/config"
	"github.com/fluxionwatt/gridbeat/internal/models"
	"github.com/glebarez/sqlite"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// Open opens sqlite database under cfg.App.DB.Dir.
// Open 在 cfg.App.DB.Dir 下打开 sqlite 数据库。
func Open(cfg *config.Config, errorLogger *logrus.Logger) (*gorm.DB, error) {
	if err := config.EnsureDBDir(cfg.DataPath); err != nil {
		return nil, err
	}

	if err := os.MkdirAll(cfg.DataPath, 0o755); err != nil {
		return nil, fmt.Errorf("failed to create dir %s: %w", cfg.DataPath, err)
	}

	// Use a conservative logger level in production.
	// 生产环境建议降低日志等级。
	gormCfg := &gorm.Config{
		//Logger: logger.Default.LogMode(logger.Warn),
		Logger: models.NewLogrusLogger(errorLogger),
	}

	db, err := gorm.Open(sqlite.Open(filepath.Join(cfg.DataPath, "app.db")), gormCfg)
	if err != nil {
		return nil, fmt.Errorf("open sqlite failed: %w", err)
	}

	// 获取通用数据库对象 sql.DB ，然后使用其提供的功能
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %v", err)
	}

	// SetMaxIdleConns 用于设置连接池中空闲连接的最大数量。
	sqlDB.SetMaxIdleConns(10)

	// SetMaxOpenConns 设置打开数据库连接的最大数量。
	sqlDB.SetMaxOpenConns(100)

	// SetConnMaxLifetime 设置了连接可复用的最大时间。
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db, nil
}
