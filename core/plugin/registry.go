package plugin

import (
	"github.com/gofiber/fiber/v3"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/sirupsen/logrus"
)

type Creator func(config fiber.Map, errorLogger *logrus.Logger, mqtt *mqtt.Server) (Conflux, error)

var Plugins = make(map[string]Creator)

func Add(name string, creator Creator) {
	Plugins[name] = creator
}

// Conflux ...
type Conflux interface {
	// Reset resets the Conflux
	Reset() error

	// Close closes the storage and will stop any running garbage
	// collectors and open connections.
	Close() error

	Push()
}
