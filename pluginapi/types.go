package pluginapi

// InstanceConfig 保存单个实例的配置（通用 KV）
// InstanceConfig holds configuration for a single plugin instance (generic key-value).
type InstanceConfig map[string]any

// Instance 表示某个插件类型的一条运行实例
// Instance represents a single runtime instance of a plugin type.
type Instance interface {
	// 返回唯一实例 ID，例如 "goose-1"
	// Returns unique instance ID, e.g. "goose-1".
	ID() string

	// 返回插件类型名，例如 "goose"
	// Returns plugin type, e.g. "goose".
	Type() string

	// 创建后由宿主调用，负责初始化（起 goroutine / 建连接等）
	// Called once after creation to initialize resources.
	Init() error

	// 销毁前由宿主调用，负责释放资源（停 goroutine / 关连接等）
	// Called before destruction to free all resources.
	Close() error
}

// Factory 表示某个插件类型（驱动），负责创建多个实例
// Factory represents a plugin type (driver), responsible for creating instances.
type Factory interface {
	// 返回插件类型名（全局唯一），例如 "goose"
	// Returns plugin type name (globally unique), e.g. "goose".
	Type() string

	// 根据实例 ID + 配置创建实例
	// Creates a new instance with given ID and config.
	New(id string, cfg InstanceConfig) (Instance, error)
}
