package mqtt

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"sync"
	"time"

	"github.com/eclipse/paho.golang/autopaho"
	"github.com/eclipse/paho.golang/paho"
	"github.com/fluxionwatt/gridbeat/internal/models"
	"github.com/fluxionwatt/gridbeat/pluginapi"
	"github.com/fluxionwatt/gridbeat/utils/modbus"
	"github.com/fluxionwatt/gridbeat/version"
	"github.com/sirupsen/logrus"
)

// ModbusInstance：具体插件实例，实现 pluginapi.Instance
// ModbusInstance: concrete plugin instance implementing pluginapi.Instance.
type ModbusInstance struct {
	id  string
	typ string

	cfg    InstanceConfig
	Status models.InstanceStatus

	logger logrus.FieldLogger // 实例级 logger / per-instance logger
	client *modbus.ModbusClient

	cliCfg *autopaho.ClientConfig

	parentCtx context.Context
	ctx       context.Context
	cancel    context.CancelFunc
	wg        sync.WaitGroup

	env *pluginapi.HostEnv

	mu   sync.Mutex
	init bool
}

func (m *ModbusInstance) ID() string   { return m.id }
func (m *ModbusInstance) Type() string { return m.typ }

// Init：用 parent ctx + HostEnv 初始化实例并启动轮询协程
// Init: initialize instance with parent ctx + HostEnv and start poller goroutine.
func (m *ModbusInstance) Init(parent context.Context, env *pluginapi.HostEnv) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.init {
		// 已经初始化过，通常不需要重复 Init
		// Already initialized; usually no need to re-init.
		return nil
	}

	if parent == nil {
		parent = context.Background()
	}
	m.parentCtx = parent
	m.env = env

	// 默认配置 / default config

	if m.cfg.Quantity == 0 {
		m.cfg.Quantity = 10
	}
	if m.cfg.RegType == "" {
		m.cfg.RegType = "holding"
	}

	// logger：优先用 HostEnv.Logger，否则新建一个
	// logger: prefer HostEnv.Logger, otherwise create a new one.
	if env != nil && env.Logger != nil {
		m.logger = env.PluginLog.WithField("plugin", "mbus").WithField("instance", m.id)
	}
	// 实例级 ctx / instance-level ctx
	m.ctx, m.cancel = context.WithCancel(parent)

	// 1. 配置 Broker 地址 (MQTT v5 默认端口 1883)
	u, err := url.Parse("tcp://broker.emqx.io:1883")
	if err != nil {
		log.Fatalf("解析地址失败: %v", err)
	}

	// 2. 配置 autopaho 客户端
	m.cliCfg = &autopaho.ClientConfig{
		ServerUrls:                    []*url.URL{u},
		KeepAlive:                     20,
		CleanStartOnInitialConnection: false, // 设置为 false 以利用 MQTT 会话持久化
		SessionExpiryInterval:         3600,  // 会话过期时间（秒）

		// 每次连接建立（或重连）后自动执行的操作
		OnConnectionUp: func(cm *autopaho.ConnectionManager, connAck *paho.Connack) {
			log.Println("MQTT 连接已建立/已恢复")
			// 自动重新订阅主题
			if _, err := cm.Subscribe(m.ctx, &paho.Subscribe{
				Subscriptions: []paho.SubscribeOptions{
					{Topic: "device/" + version.MachineID, QoS: 1},
				},
			}); err != nil {
				log.Printf("订阅失败: %v", err)
			}
		},

		// 配置底层的 paho 客户端参数
		ClientConfig: paho.ClientConfig{
			ClientID: "go_autopaho_client_2026",
			// 收到消息的回调函数
			OnPublishReceived: []func(paho.PublishReceived) (bool, error){
				func(pr paho.PublishReceived) (bool, error) {
					MessageHandler(pr.Packet.Topic, pr.Packet.Payload)
					return true, nil
				},
			},
			OnClientError: func(err error) { log.Printf("客户端错误: %v", err) },
		},
	}

	// 启动一个协程：负责自动 Open/Close + 周期读寄存器
	// Start one goroutine: handles Open/Close + periodic register reads.
	m.wg.Add(1)
	go func(cfg *InstanceConfig) {
		defer m.wg.Done()
		m.runPoller(cfg)
	}(&m.cfg)

	m.init = true
	m.logger.Infof("modbus instance initialized, url=%s unit=%d start=%d quantity=%d regType=%s",
		m.cfg.URL, m.cfg.UnitID, m.cfg.StartAddr, m.cfg.Quantity, m.cfg.RegType)

	return nil
}

// runPoller：内部轮询逻辑，在单独协程中运行
// runPoller: internal polling loop, runs in a dedicated goroutine.
func (m *ModbusInstance) runPoller(cfg *InstanceConfig) {

	// 3. 启动连接管理器
	cm, err := autopaho.NewConnection(m.ctx, *m.cliCfg)
	if err != nil {
		log.Fatalf("启动失败: %v", err)
	}

	// 4. 等待连接成功
	if err = cm.AwaitConnection(m.ctx); err != nil {
		log.Fatalf("无法连接到 Broker: %v", err)
	}

	for {
		// 如果上层 ctx 已取消，直接退出
		// If parent context is done, exit.
		select {
		case <-m.ctx.Done():
			m.logger.Infof("modbus poller exit: ctx=%v", m.ctx.Err())
			return
		default:
		}

	}
}

// Close：停止轮询、关闭 client
// Close: stop poller and close client.
func (m *ModbusInstance) Close() error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if !m.init {
		return nil
	}

	if m.cancel != nil {
		m.cancel()
	}

	// 等待轮询协程退出 / wait for poller goroutine to exit.
	m.wg.Wait()

	// 关闭底层 client（如果轮询协程已经关闭，这里 Close() 基本是幂等的）
	// Close underlying client (poller already closed it, so this is mostly idempotent).
	if m.client != nil {
		_ = m.client.Close()
		m.client = nil
	}

	m.ctx = nil
	m.cancel = nil
	m.init = false

	if m.logger != nil {
		m.logger.Infof("modbus instance closed")
	}
	return nil
}

func (m *ModbusInstance) Get() any {
	return m.Status
}

// UpdateConfig：支持运行时配置更新（包括 URL、端口等），必要时重启 Modbus 客户端
// UpdateConfig: support runtime config updates (including URL/port), restarting client if needed.
func (m *ModbusInstance) UpdateConfig(raw pluginapi.InstanceConfig) error {
	m.mu.Lock()

	newCfg := m.cfg

	if raw != nil {

		if v, ok := raw.(InstanceConfig); ok {
			newCfg = v
		}
	}

	// 填充默认值（防止被设置成 0） / fill defaults.

	if newCfg.Quantity == 0 {
		newCfg.Quantity = 10
	}
	if newCfg.RegType == "" {
		newCfg.RegType = "holding"
	}

	// 判断是否需要重启（任意字段变化就重启，简单粗暴但安全）
	// Decide if restart is needed (restart on any change: simple and safe).
	needRestart := (newCfg != m.cfg)

	// 更新内存中的配置 / update in-memory cfg.
	m.cfg = newCfg

	parent := m.parentCtx
	env := m.env
	logger := m.logger

	m.mu.Unlock()

	if !needRestart {
		if logger != nil {
			logger.Infof("modbus config updated without restart: url=%s unit=%d start=%d qty=%d regType=%s",
				m.cfg.URL, m.cfg.UnitID, m.cfg.StartAddr, m.cfg.Quantity, m.cfg.RegType)
		}
		return nil
	}

	if logger != nil {
		logger.Infof("modbus config changed, restarting client: url=%s unit=%d start=%d qty=%d regType=%s",
			m.cfg.URL, m.cfg.UnitID, m.cfg.StartAddr, m.cfg.Quantity, m.cfg.RegType)
	}

	// 1) 关闭当前实例（停止轮询 + 关闭 client）
	// 1) Close current instance (stop poller and close client).
	if err := m.Close(); err != nil {
		return fmt.Errorf("modbus[%s]: close before restart failed: %w", m.id, err)
	}

	// 2) 检查 parent ctx 是否还有效
	// 2) Ensure parent ctx is still valid.
	if parent == nil {
		parent = context.Background()
	}
	if err := parent.Err(); err != nil {
		if logger != nil {
			logger.Warnf("parent context canceled, skip restart: %v", err)
		}
		return err
	}

	// 3) 用新配置 + 原来的 parent/env 重新 Init
	// 3) Re-init with new cfg + original parent/env.
	return m.Init(parent, env)
}

// ModbusFactory：实现 Factory 接口
// ModbusFactory: implements pluginapi.Factory.
type ModbusFactory struct{}

func (f *ModbusFactory) Type() string { return "mqtt" }

// New：根据配置创建实例（真正启动在 Init 中完成）
// New: create an instance from config (real start happens in Init).
func (f *ModbusFactory) New(id string, raw pluginapi.InstanceConfig) (pluginapi.Instance, error) {
	if id == "" {
		return nil, fmt.Errorf("modbus: empty instance id")
	}

	var cfg InstanceConfig

	if raw != nil {
		if v, ok := raw.(InstanceConfig); ok {
			cfg = v
		}
	}

	return &ModbusInstance{
		id:  id,
		typ: f.Type(),
		cfg: cfg,
	}, nil
}

// init：注册工厂
// init: register factory.
func init() {
	pluginapi.RegisterFactory(&ModbusFactory{})
}

// parseRegType：把字符串映射到 modbus.RegType
// parseRegType: map string to modbus.RegType.
func parseRegType(s string) modbus.RegType {
	switch s {
	case "input", "input_register", "ir":
		return modbus.INPUT_REGISTER
	case "holding", "holding_register", "hr":
		fallthrough
	default:
		return modbus.HOLDING_REGISTER
	}
}

// sleepWithContext：带 ctx 的 sleep，返回是否正常 sleep 完成
// sleepWithContext: sleep with ctx, returns whether it completed normally.
func sleepWithContext(ctx context.Context, d time.Duration) bool {
	timer := time.NewTimer(d)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return false
	case <-timer.C:
		return true
	}
}
