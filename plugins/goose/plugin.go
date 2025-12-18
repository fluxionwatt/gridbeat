package goose

import (
	"fmt"
	"log"
	"time"

	"github.com/fluxionwatt/gridbeat/pluginapi"
)

// GooseConfig：单个 goose 实例的配置
// GooseConfig holds configuration for a single goose instance.
type GooseConfig struct {
	DSN           string        // 示例：数据源 / example: data source
	FlushInterval time.Duration // 定期任务间隔 / periodic task interval
}

// GooseInstance：具体实例实现
// GooseInstance is a concrete plugin instance.
type GooseInstance struct {
	id   string
	typ  string
	cfg  GooseConfig
	done chan struct{}
}

func (g *GooseInstance) ID() string   { return g.id }
func (g *GooseInstance) Type() string { return g.typ }

// Init：启动后台任务（goroutine）等
// Init starts background work such as goroutines.
func (g *GooseInstance) Init() error {
	if g.cfg.FlushInterval == 0 {
		g.cfg.FlushInterval = 5 * time.Second
	}
	log.Printf("[goose] init instance=%s dsn=%s interval=%s",
		g.id, g.cfg.DSN, g.cfg.FlushInterval)

	g.done = make(chan struct{})
	go func() {
		ticker := time.NewTicker(g.cfg.FlushInterval)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				log.Printf("[goose] instance=%s tick", g.id)
			case <-g.done:
				log.Printf("[goose] instance=%s stopped", g.id)
				return
			}
		}
	}()
	return nil
}

// Close：停止后台任务并释放资源
// Close stops background work and releases resources.
func (g *GooseInstance) Close() error {
	if g.done != nil {
		close(g.done)
	}
	log.Printf("[goose] close instance=%s", g.id)
	return nil
}

// GooseFactory：实现 Factory 接口的工厂
// GooseFactory implements pluginapi.Factory for type "goose".
type GooseFactory struct{}

// Type 返回插件类型名
// Type returns the plugin type name.
func (f *GooseFactory) Type() string { return "goose" }

// New：根据通用配置 map 创建实例
// New creates a new GooseInstance from a generic config map.
func (f *GooseFactory) New(id string, raw pluginapi.InstanceConfig) (pluginapi.Instance, error) {
	if id == "" {
		return nil, fmt.Errorf("goose: empty instance id")
	}
	var cfg GooseConfig

	if raw != nil {
		if v, ok := raw["dsn"].(string); ok {
			cfg.DSN = v
		}
		if v, ok := raw["flush_interval"].(string); ok && v != "" {
			dur, err := time.ParseDuration(v)
			if err != nil {
				return nil, fmt.Errorf("goose: invalid flush_interval=%q: %w", v, err)
			}
			cfg.FlushInterval = dur
		}
	}

	return &GooseInstance{
		id:  id,
		typ: f.Type(),
		cfg: cfg,
	}, nil
}

// init：进程启动时自动注册内置 goose 工厂
// init registers the built-in goose factory at process startup.
func init() {
	pluginapi.RegisterFactory(&GooseFactory{})
}
