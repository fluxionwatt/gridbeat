package core

import (
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/sirupsen/logrus"

	"github.com/fluxionwatt/gridbeat/core/plugin"
	_ "github.com/fluxionwatt/gridbeat/core/plugin/modbusrtu"
	_ "github.com/fluxionwatt/gridbeat/core/plugin/stream"
)

func ServerPlugins(server *mqtt.Server, errorLogger *logrus.Logger) {

	for _, plugin := range plugin.Plugins {
		pluginCreate, err := plugin(nil, errorLogger, server)
		if err != nil {
			errorLogger.Fatal(err)
		}

		pluginCreate.Push()
	}
}
