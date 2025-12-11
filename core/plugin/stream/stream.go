package stream

import (
	"github.com/fluxionwatt/gridbeat/core/plugin"
	"github.com/gofiber/fiber/v3"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/sirupsen/logrus"
	//_ "github.com/bluenviron/mediamtx"
)

// Storage interface that is implemented by storage providers
type Storage struct {
	logger *logrus.Logger
	done   chan struct{}
}

// New creates a new storage
func New(c fiber.Map, errorLogger *logrus.Logger, mqtt *mqtt.Server) (plugin.Conflux, error) {
	// Set default config

	// Create storage
	store := &Storage{
		logger: errorLogger,
		done:   make(chan struct{}),
	}

	return store, nil
}

// Reset all entries, including unexpired ones
func (s *Storage) Reset() error {
	//return s.ResetWithContext(context.Background())
	return nil
}

func (s *Storage) Push() {
	go func() {
	}()
}

// Close the database
func (s *Storage) Close() error {

	return nil
}

func init() {
	plugin.Add("stream", New)
}
