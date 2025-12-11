package cmd

import (
	"fmt"

	"github.com/fluxionwatt/gridbeat/version"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(versionCmd)
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number",
	Run: func(_ *cobra.Command, _ []string) {
		fmt.Printf("%v %v/%v(%v)\n", version.ProgramName, version.Version, version.CommitSHA, version.BUILDTIME)
	},
}
