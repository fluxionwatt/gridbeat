package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	cfgFile string
)

// rootCmd is the base command for gridbeat.
// rootCmd 是 gridbeat 的根命令。
var rootCmd = &cobra.Command{
	Use:   "gridbeat",
	Short: "gridbeat industrial gateway / 工业网关",
	Long:  "gridbeat: an industrial gateway with user/token/audit subsystem. / gridbeat：包含用户/Token/审计子系统的工业网关。",
}

// Execute runs the root command.
// Execute 执行根命令。
func Execute() {
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file path / 配置文件路径")

	// Add subcommands.
	// 添加子命令。
	rootCmd.AddCommand(serverCmd())
	rootCmd.AddCommand(resetPasswordCmd())

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
