package core

var Gconfig Config

type Config struct {
	Debug       bool   `mapstructure:"debug"`
	Daemon      bool   `mapstructure:"daemon"`
	DisableAuth bool   `mapstructure:"disable_auth"`
	Plugins     string `mapstructure:"plugins"`
	LogPath     string `mapstructure:"log-path"`
	DataPath    string `mapstructure:"data-path"`
	ExtraPath   string `mapstructure:"extra-path"`
	PID         string `mapstructure:"pid"`
	HTTP        struct {
		Port          uint16 `mapstructure:"port"`
		RedirectHTTPS bool   `mapstructure:"redirect_https"`
	} `mapstructure:"http"`

	HTTPS struct {
		Disable bool   `mapstructure:"disable"`
		Port    uint16 `mapstructure:"port"`
	} `mapstructure:"https"`
	MQTT struct {
		Host string `mapstructure:"host"`
		Port uint16 `mapstructure:"port"`
	} `mapstructure:"mqtt"`

	Simulator struct {
		MaxSlaveId uint16 `mapstructure:"max_slave_id"`
		ModbusRTU  []struct {
			Name     string `mapstructure:"name"`
			Rate     uint   `mapstructure:"rate"`
			DataRate uint   `mapstructure:"datarate"`
			StopBits uint   `mapstructure:"stopbits"`
			Parity   uint   `mapstructure:"parity"`
		} `mapstructure:"modbus-rtu"`
		Devices []struct {
			Name            string `json:"name" mapstructure:"name"`
			SN              string `json:"sn" mapstructure:"sn"`
			DeviceType      string `son:"device_type" mapstructure:"device_type"`
			DevicePlugin    string `json:"device_plugin" mapstructure:"device_plugin"`
			SoftwareVersion string `son:"software_version" mapstructure:"software_version"`
			Model           string `json:"model" mapstructure:"model"`
			Disable         bool   `json:"disable" mapstructure:"disable"`
			URL             string `json:"url" mapstructure:"url"`
		} `mapstructure:"devices"`
	}
}
