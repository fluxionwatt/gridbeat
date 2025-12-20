package pluginapi

import (
	"github.com/fluxionwatt/gridbeat/internal/config"
	mqtt "github.com/mochi-mqtt/server/v2"
	"gorm.io/gorm"
)

// HostEnv 表示宿主环境中可注入到插件实例的全局对象
// HostEnv represents global objects from the host that can be injected into plugin instances.
type HostEnv struct {

	// Values：扩展用，可以放任意其他全局对象（DB、metrics、缓存客户端等）
	// Values: extension map for arbitrary global objects (DB, metrics, cache clients, etc).
	//Values map[string]any

	Conf   *config.Config
	DB     *gorm.DB
	Logger *ReopenLogger

	MQTT *mqtt.Server
}
