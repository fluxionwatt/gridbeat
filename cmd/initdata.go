package cmd

import (
	"github.com/spf13/cobra"
)

var initDataCmd = &cobra.Command{
	Use:   "init",
	Short: "init data",
	Run: func(_ *cobra.Command, _ []string) {

		/*
			d := &models.Channel{
				Plugin:          "modbusrtu",
				UUID:            uuid.New().String(),
				Name:            "/dev/ttys012",
				Delay:           1000,
				URL:             "rtu:///dev/ttys012",
				DebugLog:        true,
				PhysicalLink:    "serial",
				VerifyHeader:    false,
				OnnectTimeout:   3000,
				Downgrade:       false,
				RetryMax:        3,
				RetryInterval:   1000,
				ByteOrder4:      "ABCD",
				ByteOrder8:      "ABCDEFGH",
				AddrStart:       true,
				SendInterval:    100,
				SerialName:      "/dev/ttys012",
				StopBits:        2,
				Speed:           19200,
				DataBits:        8,
				Parity:          0,
				TCPIPAddr:       "",
				TCPPort:         0,
				BackupTCPIPAddr: "",
				BackupTCPPort:   0,
				Disable:         false,
				CreatedAt:       time.Now(),
				UpdatedAt:       time.Now(),
			}
		*/
	},
}
