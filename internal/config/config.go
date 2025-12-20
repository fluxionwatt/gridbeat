package config

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/spf13/viper"
)

// Config holds application configuration.
// Config 保存应用配置。
type Config struct {
	Debug       bool   `mapstructure:"debug"`
	DisableAuth bool   `mapstructure:"disable_auth"`
	Plugins     string `mapstructure:"plugins"`
	LogPath     string `mapstructure:"log-path"`
	DataPath    string `mapstructure:"data-path"`
	ExtraPath   string `mapstructure:"extra-path"`
	PID         string `mapstructure:"pid"`
	HTTP        struct {
		Port          uint16 `mapstructure:"port"`
		RedirectHTTPS bool   `mapstructure:"redirect_https"`
	} `mapstructure:"http"`

	HTTPS struct {
		Disable bool   `mapstructure:"disable"`
		Port    uint16 `mapstructure:"port"`
	} `mapstructure:"https"`
	MQTT struct {
		Host string `mapstructure:"host"`
		Port uint16 `mapstructure:"port"`
	} `mapstructure:"mqtt"`
	Serial    []string `mapstructure:"serial"`
	Simulator struct {
		MaxSlaveId uint16 `mapstructure:"max_slave_id"`
		ModbusRTU  []struct {
			Name     string `mapstructure:"name"`
			Rate     uint   `mapstructure:"rate"`
			DataRate uint   `mapstructure:"datarate"`
			StopBits uint   `mapstructure:"stopbits"`
			Parity   uint   `mapstructure:"parity"`
		} `mapstructure:"modbus-rtu"`
		Devices []struct {
			Name            string `json:"name" mapstructure:"name"`
			SN              string `json:"sn" mapstructure:"sn"`
			DeviceType      string `son:"device_type" mapstructure:"device_type"`
			DevicePlugin    string `json:"device_plugin" mapstructure:"device_plugin"`
			SoftwareVersion string `son:"software_version" mapstructure:"software_version"`
			Model           string `json:"model" mapstructure:"model"`
			Disable         bool   `json:"disable" mapstructure:"disable"`
			URL             string `json:"url" mapstructure:"url"`
		} `mapstructure:"devices"`
	}

	Auth struct {
		JWT struct {
			Secret string `mapstructure:"secret"`
			Issuer string `mapstructure:"issuer"`
		} `mapstructure:"jwt"`
		Web struct {
			IdleMinutes int `mapstructure:"idle_minutes"`
		} `mapstructure:"web"`
	} `mapstructure:"auth"`

	Audit struct {
		RetentionDays int `mapstructure:"retention_days"`
	} `mapstructure:"audit"`
}

// Load loads config from file and environment variables.
// Load 从配置文件与环境变量加载配置。
func Load(configFile string) (*Config, error) {
	v := viper.New()

	// Environment variables: GRIDBEAT_APP_DB_DIR, GRIDBEAT_AUTH_JWT_SECRET ...
	// 环境变量：GRIDBEAT_APP_DB_DIR, GRIDBEAT_AUTH_JWT_SECRET ...
	v.SetEnvPrefix("GRIDBEAT")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	// Defaults / 默认值
	v.SetDefault("app.db.dir", "./data/db")
	v.SetDefault("auth.jwt.secret", "change-me")
	v.SetDefault("auth.jwt.issuer", "gridbeat")
	v.SetDefault("auth.web.idle_minutes", 30)
	v.SetDefault("audit.retention_days", 120)
	v.SetDefault("server.listen", ":8080")

	// Search config file in common locations if not specified.
	// 如果没有显式指定，则在常见路径中查找配置文件。
	if configFile != "" {
		v.SetConfigFile(configFile)
	} else {
		v.SetConfigName("config")
		v.SetConfigType("yaml")
		v.AddConfigPath(".")
		v.AddConfigPath("/etc/gridbeat")
	}

	if err := v.ReadInConfig(); err != nil {
		// It's ok if config file doesn't exist; env + defaults still work.
		// 配置文件不存在也没关系：环境变量与默认值仍然生效。
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("read config failed: %w", err)
		}
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("unmarshal config failed: %w", err)
	}

	return &cfg, nil
}

// EnsureDBDir ensures db dir exists.
// EnsureDBDir 确保数据库目录存在。
func EnsureDBDir(dbDir string) error {
	if err := os.MkdirAll(dbDir, 0o755); err != nil {
		return fmt.Errorf("create db dir failed: %w", err)
	}
	return nil
}

// WebIdleTimeout returns web idle timeout as duration.
// WebIdleTimeout 返回 Web 空闲超时的 duration。
func (c *Config) WebIdleTimeout() time.Duration {
	return time.Duration(c.Auth.Web.IdleMinutes) * time.Minute
}
