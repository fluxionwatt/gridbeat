package pluginapi

// Plugin 是所有插件都要实现的接口
type Plugin interface {
	Name() string
	Init() error
}
