package cmd

import (
	"fmt"

	"github.com/fluxionwatt/gridbeat/version"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(resetPasswordCmd)
}

var resetPasswordCmd = &cobra.Command{
	Use:   "reset-password",
	Short: "reset the admin password",
	Run: func(_ *cobra.Command, _ []string) {
		fmt.Printf("%v %v/%v(%v)\n", version.ProgramName, version.Version, version.CommitSHA, version.BUILDTIME)
	},
}
