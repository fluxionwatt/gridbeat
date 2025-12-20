package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/fluxionwatt/gridbeat/core"
	"github.com/fluxionwatt/gridbeat/version"
	"github.com/fsnotify/fsnotify"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	// Used for flags.
	cfgFile string

	rootCmd = &cobra.Command{
		Use:   version.ProgramName,
		Short: "An open-source software for data acquisition and monitoring",
		Long: `GridBeat is an open-source software for data acquisition and monitoring 
		of solar photovoltaic systems, energy storage systems, and charging piles.`,
	}
)

// Execute executes the root command.
func Execute() error {
	return rootCmd.Execute()
}

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringVarP(&cfgFile, "config", "c", "", "config file (default is $PWD/"+version.ProgramName+".yaml)")
	rootCmd.PersistentFlags().BoolVar(&core.Gconfig.Debug, "debug", false, "debug mode")
	rootCmd.PersistentFlags().StringVarP(&core.Gconfig.Plugins, "plugins", "", "./plugins", "directory from which loads plugin lib files")

	rootCmd.CompletionOptions.HiddenDefaultCmd = true
}

func initConfig() {

	viper.BindPFlag("debug", rootCmd.Flags().Lookup("debug"))
	viper.BindPFlag("plugins", rootCmd.Flags().Lookup("plugins"))

	viper.SetEnvPrefix(version.ProgramName)

	// Environment variables: GRIDBEAT_APP_DB_DIR, GRIDBEAT_AUTH_JWT_SECRET ...
	// 环境变量：GRIDBEAT_APP_DB_DIR, GRIDBEAT_AUTH_JWT_SECRET ...
	viper.SetEnvPrefix(version.ProgramName)
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	// Defaults / 默认值
	viper.SetDefault("data-path", "./")
	viper.SetDefault("auth.jwt.secret", "change-me")
	viper.SetDefault("auth.jwt.issuer", "gridbeat")
	viper.SetDefault("auth.web.idle_minutes", 30)
	viper.SetDefault("audit.retention_days", 120)
	viper.SetDefault("server.listen", ":8080")

	if cfgFile != "" {
		viper.SetConfigType("yaml")
		viper.SetConfigFile(cfgFile)

		viper.OnConfigChange(func(e fsnotify.Event) {
			//errorLogger.Info("Config file changed:" + e.Name)
		})

		viper.WatchConfig()

		if err := viper.ReadInConfig(); err == nil {
			//fmt.Println("Using config file:", viper.ConfigFileUsed())
		} else {
			// return fmt.Errorf("fatal error config file: %w", err)
			cobra.CheckErr(fmt.Errorf("fatal error config file: %w", err))
		}
	} else {
		// Search config in home directory with name ".cobra" (without extension).
		//viper.SetConfigName(version.ProgramName)
		//viper.AddConfigPath("./config")
		//viper.AddConfigPath("./")
		//viper.AddConfigPath("/etc/" + version.ProgramName + "/")
	}

	// get wd
	cdir := WorkDir()

	if viper.GetString("log-path") == "" {
		viper.Set("log-path", cdir)
	}

	if viper.GetString("data-path") == "" {
		viper.Set("data-path", cdir)
	}

	if viper.GetString("extra-path") == "" {
		viper.Set("extra-path", cdir)
	}

	if viper.GetString("pid") == "" {
		viper.Set("pid", cdir+"/"+version.ProgramName+".pid")
	}

	if err := viper.Unmarshal(&core.Gconfig); err != nil {
		cobra.CheckErr(err)
	}

	cfg := &core.Gconfig

	// Normalize / 规范化
	cfg.LogPath = filepath.Clean(cfg.LogPath)
	if cfg.Auth.Web.IdleMinutes <= 0 {
		cfg.Auth.Web.IdleMinutes = 30
	}
	if cfg.Audit.RetentionDays <= 0 {
		cfg.Audit.RetentionDays = 120
	}
	if strings.TrimSpace(cfg.Auth.JWT.Issuer) == "" {
		cfg.Auth.JWT.Issuer = "gridbeat"
	}
	if strings.TrimSpace(cfg.Server.Listen) == "" {
		cfg.Server.Listen = ":8080"
	}

	if abs, err := filepath.Abs(core.Gconfig.LogPath); err != nil {
		cobra.CheckErr(err)
	} else {
		core.Gconfig.LogPath = abs
	}

	if abs, err := filepath.Abs(core.Gconfig.DataPath); err != nil {
		cobra.CheckErr(err)
	} else {
		core.Gconfig.DataPath = abs
	}

	if abs, err := filepath.Abs(core.Gconfig.ExtraPath); err != nil {
		cobra.CheckErr(err)
	} else {
		core.Gconfig.ExtraPath = abs
	}

	if core.Gconfig.MQTT.Host == "" {
		core.Gconfig.MQTT.Host = "localhost"
		viper.Set("mqtt.host", "localhost")

	}
	if core.Gconfig.MQTT.Port == 0 {
		core.Gconfig.MQTT.Port = 1883
		viper.Set("mqtt.port", "1883")
	}

	if core.Gconfig.HTTP.Port == 0 {
		core.Gconfig.HTTP.Port = 8080
		viper.Set("http.port", "8080")
	}
	if core.Gconfig.HTTPS.Port == 0 {
		core.Gconfig.HTTPS.Port = 8443
		viper.Set("https.port", "8443")
	}
}

func WorkDir() string {
	dir, _ := os.Getwd()
	return dir
}

func ExeDir() string {
	exe, _ := os.Executable()
	return filepath.Dir(exe)
}
