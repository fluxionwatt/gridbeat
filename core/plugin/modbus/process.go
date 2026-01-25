package modbus

import (
	"os"
	"os/exec"

	"github.com/sirupsen/logrus"
)

func (m *ModbusInstance) createSocat() {

	m.socat = exec.Command("/opt/homebrew/bin/socat",
		"-d", "-d",
		"pty,raw,echo=0,link="+m.cfg.Channel.Device,
		"pty,raw,echo=0,link="+m.cfg.Channel.Device+"-slave",
	)

	if entry, ok := m.logger.(*logrus.Entry); ok {
		m.socat.Stdout = entry.WriterLevel(logrus.InfoLevel)
		m.socat.Stderr = entry.WriterLevel(logrus.InfoLevel)
	}

	os.Remove(m.cfg.Channel.Device)
	os.Remove(m.cfg.Channel.Device + "-slave")
}

/*
if err := cmd.Run(); err != nil {
		panic(err)
	}
*/
