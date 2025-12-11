package modbusrtu

import (
	"time"

	"github.com/fluxionwatt/gridbeat/core/plugin"
	"github.com/fluxionwatt/gridbeat/model"
	"github.com/fluxionwatt/gridbeat/utils/modbus"
	"github.com/gofiber/fiber/v3"
	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/sirupsen/logrus"
)

type StorageChannel struct {
	Channel model.Channel
	Client  *modbus.ModbusClient
	done    chan struct{}
}

// Storage interface that is implemented by storage providers
type Storage struct {
	logger *logrus.Logger
	done   chan struct{}

	Channel map[string]StorageChannel
}

// New creates a new storage
func New(c fiber.Map, runLogger *logrus.Logger, mqtt *mqtt.Server) (plugin.Conflux, error) {
	// Set default config

	var config []Config = make([]Config, 1)

	cfg := configDefault(config...)

	cfg.Timeout = 300 * time.Millisecond

	// Create storage
	store := &Storage{
		logger:  runLogger,
		Channel: make(map[string]StorageChannel),
		done:    make(chan struct{}),
	}

	ch := model.GetChannel()

	for _, element := range ch {

		var err error
		var client *modbus.ModbusClient
		if client, err = modbus.NewClient(&modbus.ClientConfiguration{
			URL:      element.URL,
			Speed:    element.Speed,
			DataBits: element.DataBits,
			Parity:   element.Parity,
			StopBits: element.StopBits,
			Timeout:  cfg.Timeout,
		}); err != nil {
			// error out if client creation failed
			runLogger.Error(err)
			continue
		}

		// now that the client is created and configured, attempt to connect
		err = client.Open()
		if err != nil {
			// error out if we failed to connect/open the device
			// note: multiple Open() attempts can be made on the same client until
			// the connection succeeds (i.e. err == nil), calling the constructor again
			// is unnecessary.
			// likewise, a client can be opened and closed as many times as needed.
			runLogger.Error(err)
			continue
		}

		store.Channel[element.UUID] = StorageChannel{
			Channel: element,
			Client:  client,
			done:    make(chan struct{}),
		}

	}

	return store, nil
}

// Reset all entries, including unexpired ones
func (s *Storage) Reset() error {
	//return s.ResetWithContext(context.Background())
	return nil
}

func (s *Storage) Push() {
	for _, element := range s.Channel {
		go func() {
			ticker := time.NewTicker(1 * time.Second)
			for {
				<-ticker.C

				element.Client.SetUnitId(1)
				// read a single 16-bit holding register at address 100
				var reg16 []uint16
				var err error
				reg16, err = element.Client.ReadRegisters(100, 1, modbus.HOLDING_REGISTER)
				if err != nil {
					// error out
					s.logger.Error("read registers ", err)
				} else {
					s.logger.Info("read registers value: ", reg16)
				}
			}
			element.Client.Close()
		}()
	}
}

// Close the database
func (s *Storage) Close() error {
	s.done <- struct{}{}
	//return s.db.Close()

	// s.client.Close()

	return nil
}

func init() {
	plugin.Add("modbusrtu", New)
}
