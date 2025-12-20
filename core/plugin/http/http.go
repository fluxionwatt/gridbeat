package http

import (
	"context"
	"crypto/tls"
	"fmt"
	"sync"
	"time"

	"github.com/fluxionwatt/gridbeat/core"
	"github.com/fluxionwatt/gridbeat/internal/api"
	"github.com/fluxionwatt/gridbeat/pluginapi"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

// HTTPServerConfig：单个 httpserver 实例的配置
// HTTPServerConfig: configuration for a single httpserver instance.
type HTTPServerConfig struct {
	// 监听地址，例如 ":8080" 或 "0.0.0.0:9000"
	// Listen address, e.g. ":8080" or "0.0.0.0:9000".
	Address string `mapstructure:"address"`

	// 路由前缀，例如 "/api"；默认 "/"。
	// Route prefix, e.g. "/api"; default "/".
	BasePath string `mapstructure:"base_path"`

	HTTPS bool
}

// HTTPServerInstance：具体实例，实现 pluginapi.Instance
// HTTPServerInstance: concrete instance implementing pluginapi.Instance.
type HTTPServerInstance struct {
	api.Server

	id  string
	typ string
	cfg HTTPServerConfig

	logger logrus.FieldLogger // 实例级 logger / per-instance logger
	app    *fiber.App

	// parentCtx：Init 传入的父 context，用于重启时复用
	// parentCtx: parent context passed to Init, reused on restart.
	parentCtx context.Context

	ctx    context.Context
	cancel context.CancelFunc
	wg     sync.WaitGroup

	env *pluginapi.HostEnv

	mu   sync.Mutex
	init bool
}

func (s *HTTPServerInstance) ID() string   { return s.id }
func (s *HTTPServerInstance) Type() string { return s.typ }

// Init：使用 parent ctx + HostEnv 初始化实例，并启动 HTTP 服务
// Init: initialize instance with parent ctx + HostEnv, and start HTTP server.
func (s *HTTPServerInstance) Init(parent context.Context, env *pluginapi.HostEnv) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.init {
		// 已经初始化过，通常不需要重复 Init
		// Already initialized; usually no need to re-init.
		return nil
	}

	if parent == nil {
		parent = context.Background()
	}
	s.parentCtx = parent
	s.env = env

	// 配置默认值 / default config.
	if s.cfg.Address == "" {
		s.cfg.Address = ":8080"
	}
	if s.cfg.BasePath == "" {
		s.cfg.BasePath = "/"
	}

	// 设置 logger：优先用 HostEnv.Logger，其次自己创建
	// Setup logger: prefer HostEnv.Logger, otherwise create a new one.
	if env != nil && env.Logger != nil {
		s.logger = env.PluginLog.WithField("plugin", "http").WithField("instance", s.id)
	}
	// 为该实例创建独立 ctx，用于控制 Fiber 和相关协程生命周期
	// Create an instance-level ctx, to control Fiber and related goroutines.
	s.ctx, s.cancel = context.WithCancel(parent)

	s.app = NewHandler(env.Logger.RunLogger, env.Logger.AccessLogger)

	s.app.Use("/public/extra", static.New(core.Gconfig.ExtraPath, static.Config{
		Browse:    true,
		Download:  true,
		ByteRange: true,
		Compress:  true,
	}))

	s.app.Use("/public/log", static.New(core.Gconfig.LogPath, static.Config{
		Browse:    true,
		Download:  true,
		ByteRange: true,
		Compress:  true,
	}))

	s.Server.Cfg = env.Conf
	s.Server.DB = env.DB
	s.Server.App(s.app)

	// 注册路由 / Register routes.
	base := s.cfg.BasePath
	if base == "" {
		base = "/"
	}

	// 协程 1：启动 Fiber HTTP 服务器（阻塞 Listen）
	// Goroutine 1: start Fiber HTTP server (blocking Listen).
	s.wg.Add(1)
	go func(addr string) {
		defer s.wg.Done()
		s.logger.Infof("starting Fiber v3 HTTP server on %s (basePath=%s)", addr, base)

		if s.cfg.HTTPS {
			cert, _ := tls.X509KeyPair([]byte(certPEM), []byte(keyPEM))

			tlsConf := &tls.Config{
				Certificates: []tls.Certificate{cert},
				MinVersion:   tls.VersionTLS12,
			}

			ln, err := tls.Listen("tcp", ":"+viper.GetString("https.port"), tlsConf)
			if err != nil {
				s.logger.Fatal("tls listen failed: ", err)
			}

			if err := s.app.Listener(ln, fiber.ListenConfig{
				DisableStartupMessage: true,
				TLSMinVersion:         tls.VersionTLS12,
			}); err != nil {
				s.logger.Fatal(err)
			}
		} else {
			// Listen 会阻塞直到 Shutdown 被调用或发生错误
			// Listen blocks until Shutdown is called or an error occurs.
			if err := s.app.Listen(addr, fiber.ListenConfig{
				DisableStartupMessage: true,
			}); err != nil {
				// Shutdown 后 Listen 通常会返回错误，可以按需过滤
				// After Shutdown, Listen usually returns an error; filter/log as needed.
				s.logger.Warnf("fiber.Listen returned: %v", err)
			}

			s.logger.Infof("Fiber HTTP server stopped (addr=%s)", addr)

			/*
							lnHTTP, err := net.Listen("tcp", ":"+viper.GetString("http.port"))
				if err != nil {
					errorLogger.Fatal("http listen failed: ", err)
				}

				fmt.Println("use http at", Gconfig.HTTP.Port)

				if err := app.Listener(lnHTTP, fiber.ListenConfig{
					DisableStartupMessage: true,
				}); err != nil {
					errorLogger.Fatal("http app.Listener failed: ", err)
				}
			*/
		}
	}(s.cfg.Address)

	// 协程 2：监听 ctx.Done()，触发 Fiber 优雅关闭
	// Goroutine 2: watch ctx.Done() and trigger graceful Fiber shutdown.
	s.wg.Add(1)
	go func() {
		defer s.wg.Done()
		<-s.ctx.Done()
		s.logger.Infof("context canceled, shutting down Fiber HTTP server...")

		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		doneCh := make(chan struct{})
		go func() {
			if err := s.app.Shutdown(); err != nil {
				s.logger.Errorf("Fiber shutdown error: %v", err)
			}
			close(doneCh)
		}()

		select {
		case <-doneCh:
			s.logger.Infof("Fiber HTTP server shutdown completed")
		case <-shutdownCtx.Done():
			s.logger.Warnf("Fiber HTTP server shutdown timed out: %v", shutdownCtx.Err())
		}
	}()

	s.init = true
	return nil
}

// Close：取消实例 ctx，等待所有协程退出
// Close: cancel instance ctx and wait for all goroutines to exit.
func (s *HTTPServerInstance) Close() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.init {
		return nil
	}

	if s.cancel != nil {
		s.cancel()
	}

	// 等待监听协程 + 关闭协程全部退出
	// Wait for listener goroutine and shutdown watcher to exit.
	s.wg.Wait()

	s.ctx = nil
	s.cancel = nil
	s.app = nil
	s.init = false

	if s.logger != nil {
		s.logger.Infof("httpserver instance closed")
	}
	return nil
}

// UpdateConfig：支持动态修改监听端口（包括更高端口），并重启 Fiber 服务
// UpdateConfig: support changing listen address (including higher port), and restart Fiber server.
func (s *HTTPServerInstance) UpdateConfig(raw pluginapi.InstanceConfig) error {
	// 先解析新配置，但不动现有服务
	// First, parse new config without touching current server.
	s.mu.Lock()

	newCfg := s.cfg

	if raw != nil {
		if v, ok := raw["address"].(string); ok && v != "" {
			newCfg.Address = v
		}
		if v, ok := raw["base_path"].(string); ok && v != "" {
			newCfg.BasePath = v
		}
	}

	// 是否需要重启：端口或 base_path 变化都需要重启
	// Decide if restart is needed: address or base_path changed.
	needRestart :=
		newCfg.Address != s.cfg.Address ||
			newCfg.BasePath != s.cfg.BasePath

	// 更新内存中的 cfg
	// Update in-memory cfg.
	s.cfg = newCfg

	parent := s.parentCtx
	env := s.env
	logger := s.logger

	s.mu.Unlock()

	if !needRestart {
		if logger != nil {
			logger.Infof("config updated without restart: address=%s basePath=%s",
				s.cfg.Address, s.cfg.BasePath)
		}
		return nil
	}

	if logger != nil {
		logger.Infof("config changed, restarting http server: address=%s basePath=%s",
			s.cfg.Address, s.cfg.BasePath)
	}

	// 1) 关闭当前实例（会停止 Fiber + 所有协程）
	// 1) Close current instance (stop Fiber and all goroutines).
	if err := s.Close(); err != nil {
		return fmt.Errorf("httpserver: close before restart failed: %w", err)
	}

	// 2) 检查 parent ctx 是否还有效，防止在已取消 ctx 上重启
	// 2) Ensure parent ctx is still valid; avoid restarting on canceled ctx.
	if parent == nil {
		parent = context.Background()
	}
	if err := parent.Err(); err != nil {
		if logger != nil {
			logger.Warnf("parent context already canceled, skip restart: %v", err)
		}
		return err
	}

	// 3) 使用新的配置 + 原来的 parent/env 重新 Init
	// 3) Re-init with new config + original parent/env.
	return s.Init(parent, env)
}

// HTTPServerFactory：实现 Factory 接口
// HTTPServerFactory: implements pluginapi.Factory.
type HTTPServerFactory struct{}

func (f *HTTPServerFactory) Type() string { return "http" }

// New：根据配置创建实例（不启动服务，Init 时才启动）
// New: create an instance from config (server starts in Init).
func (f *HTTPServerFactory) New(id string, raw pluginapi.InstanceConfig) (pluginapi.Instance, error) {
	if id == "" {
		return nil, fmt.Errorf("httpserver: empty instance id")
	}

	var cfg HTTPServerConfig
	if raw != nil {
		if v, ok := raw["address"].(string); ok {
			cfg.Address = v
		}
		if v, ok := raw["base_path"].(string); ok {
			cfg.BasePath = v
		}
		if v, ok := raw["https"].(string); ok {
			if v == "true" {
				cfg.HTTPS = true
			}
		}
	}

	return &HTTPServerInstance{
		id:  id,
		typ: f.Type(),
		cfg: cfg,
	}, nil
}

// init：注册工厂
// init: register factory.
func init() {
	pluginapi.RegisterFactory(&HTTPServerFactory{})
}
