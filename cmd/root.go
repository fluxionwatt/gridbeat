package cmd

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"plugin"

	"github.com/fluxionwatt/gridbeat/core"
	"github.com/fluxionwatt/gridbeat/pluginapi"
	"github.com/fluxionwatt/gridbeat/version"
	"github.com/fsnotify/fsnotify"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	// Used for flags.
	cfgFile       string
	resetPassword string

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

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $PWD/"+version.ProgramName+".yaml)")
	rootCmd.PersistentFlags().BoolVar(&core.Gconfig.Debug, "debug", false, "debug mode")
	rootCmd.PersistentFlags().StringVarP(&core.Gconfig.Plugins, "plugins", "", "./plugins", "load specified plugins folder")

	rootCmd.CompletionOptions.HiddenDefaultCmd = true
}

func initConfig() {

	viper.SetConfigType("yaml")

	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		// Search config in home directory with name ".cobra" (without extension).
		viper.SetConfigName(version.ProgramName)
		viper.AddConfigPath("./config")
		viper.AddConfigPath("./")
		viper.AddConfigPath("/etc/" + version.ProgramName + "/")
	}

	viper.BindPFlag("daemon", serverCmd.Flags().Lookup("daemon"))
	viper.BindPFlag("debug", rootCmd.Flags().Lookup("debug"))

	viper.SetEnvPrefix(version.ProgramName)

	viper.AutomaticEnv()

	viper.OnConfigChange(func(e fsnotify.Event) {
		//errorLogger.Info("Config file changed:" + e.Name)
	})

	viper.WatchConfig()

	if err := viper.ReadInConfig(); err == nil {
		//fmt.Println("Using config file:", viper.ConfigFileUsed())
	} else {
		// return fmt.Errorf("fatal error config file: %w", err)
		cobra.CheckErr(err)
	}

	if err := viper.Unmarshal(&core.Gconfig); err != nil {
		cobra.CheckErr(err)
		//return fmt.Errorf("unable to decode into struct: %w", err)
	}

	/*
		if loaded, err := loadAllPlugins(core.Gconfig.Plugins); err != nil {
			log.Fatalf("load plugins error: %v", err)
		} else {
			fmt.Printf("loaded %d plugins:\n", len(loaded))
			for _, p := range loaded {
				fmt.Println(" -", p.Name())
			}
		}
	*/
}

func loadAllPlugins(dir string) ([]pluginapi.Plugin, error) {
	var result []pluginapi.Plugin

	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("read dir %s: %w", dir, err)
	}

	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		if filepath.Ext(e.Name()) != ".so" {
			continue
		}

		path := filepath.Join(dir, e.Name())
		log.Printf("loading plugin: %s", path)

		p, err := plugin.Open(path)
		if err != nil {
			log.Printf("  open failed: %v", err)
			continue
		}

		// 约定每个插件都导出名为 "Plugin" 的符号
		sym, err := p.Lookup("Plugin")
		if err != nil {
			log.Printf("  lookup Plugin failed: %v", err)
			continue
		}

		pl, ok := sym.(pluginapi.Plugin)
		if !ok {
			log.Printf("  symbol Plugin type mismatch (not pluginapi.Plugin)")
			continue
		}

		// 调用插件初始化
		if err := pl.Init(); err != nil {
			log.Printf("  init failed: %v", err)
			continue
		}

		result = append(result, pl)
	}

	return result, nil
}
