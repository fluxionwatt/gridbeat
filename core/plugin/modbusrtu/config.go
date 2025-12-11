package modbusrtu

import "time"

// Config defines the config for storage.
type Config struct {
	// URL sets the client mode and target location in the form
	// <mode>://<serial device or host:port> e.g. tcp://plc:502
	URL string
	// Speed sets the serial link speed (in bps, rtu only)
	Speed uint
	// DataBits sets the number of bits per serial character (rtu only)
	DataBits uint
	// Parity sets the serial link parity mode (rtu only)
	Parity uint
	// StopBits sets the number of serial stop bits (rtu only)
	StopBits uint
	// Timeout sets the request timeout value
	Timeout time.Duration

	// Reset clears any existing keys in existing Table
	//
	// Optional. Default is false
	Reset bool

	// Time before deleting expired keys
	//
	// Optional. Default is 10 * time.Second
	GCInterval time.Duration
}

// ConfigDefault is the default config
var ConfigDefault = Config{
	// General config options
	Reset:      false,
	GCInterval: 10 * time.Second,
	// Adaptor related config options
}

// Helper function to set default values
func configDefault(config ...Config) Config {
	// Return default config if nothing provided
	if len(config) < 1 {
		return ConfigDefault
	}

	// Override default config
	cfg := config[0]

	// Set default values
	if int(cfg.GCInterval.Seconds()) <= 0 {
		cfg.GCInterval = ConfigDefault.GCInterval
	}

	return cfg
}
