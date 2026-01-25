package modbus

import (
	"time"

	"github.com/fluxionwatt/gridbeat/internal/models"
)

// runPollerRTU：内部轮询逻辑，在单独协程中运行/internal polling loop, runs in a dedicated goroutine.
func (m *ModbusInstance) runSimulatorPollerRTU(cfg *models.InstanceConfig) {

	m.logger.Infof("modbus simulator(RTU) poller started, interval=%s", cfg.Channel.RetryInterval)

	for {
		// 如果上层 ctx 已取消，直接退出
		// If parent context is done, exit.
		select {
		case <-m.ctx.Done():
			m.logger.Infof("modbus simulator(RTU) poller exit: ctx=%v", m.ctx.Err())
			return
		default:
		}

		m.Status.Working = true
		m.Status.Linking = false

		// 尝试建立连接 / try to open connection.
		if err := m.serverRTU.Start(); err != nil {
			m.logger.Errorf("modbus simulator(RTU) open %s failed: %v", m.URL, err)
			if !sleepWithContext(m.ctx, 2*time.Second) {
				m.logger.Infof("modbus simulator(RTU) poller exit during reconnect wait")
				return
			}
			continue
		}

		m.logger.Infof("modbus simulator(RTU) connected to %s", m.URL)

		m.Status.Linking = true

		ticker := time.NewTicker(cfg.Channel.RetryInterval)
		connected := true

		for connected {
			select {
			case <-m.ctx.Done():
				// 上层取消：关闭连接并退出
				// Parent canceled: close connection and exit.
				ticker.Stop()
				_ = m.serverRTU.Stop()
				m.logger.Infof("modbus simulator(RTU) poller exit on ctx done")
				return
			case <-ticker.C:
				time.Sleep(time.Second)
				// 轮询读寄存器 / poll holding/input registers.

				//m.cfg.Model.BytesReceived = m.cfg.Model.BytesReceived + 1
				//m.cfg.Model.BytesSent = m.cfg.Model.BytesSent + 1

				// 打印调试信息 / log debug values.
				m.logger.Debugf("modbus simulator(RTU) recv ok")
			}
		}
	}
}

// runPoller：内部轮询逻辑，在单独协程中运行
// runPoller: internal polling loop, runs in a dedicated goroutine.
func (m *ModbusInstance) runSimulatorPollerTCP(cfg *models.InstanceConfig) {

	m.logger.Infof("modbus simulator(TCP) poller started, interval=%s", cfg.Channel.RetryInterval)

	for {
		// 如果上层 ctx 已取消，直接退出
		// If parent context is done, exit.
		select {
		case <-m.ctx.Done():
			m.logger.Infof("modbus simulator(TCP) poller exit: ctx=%v", m.ctx.Err())
			return
		default:
		}

		m.Status.Working = true
		m.Status.Linking = false

		// 尝试建立连接 / try to open connection.
		if err := m.serverTCP.Start(); err != nil {
			m.logger.Errorf("modbus simulator(TCP) open %s failed: %v", m.URL, err)
			if !sleepWithContext(m.ctx, 2*time.Second) {
				m.logger.Infof("modbus simulator(TCP) poller exit during reconnect wait")
				return
			}
			continue
		}

		m.logger.Infof("modbus simulator(TCP) connected to %s", m.URL)

		m.Status.Linking = true

		ticker := time.NewTicker(cfg.Channel.RetryInterval)
		connected := true

		for connected {
			select {
			case <-m.ctx.Done():
				// 上层取消：关闭连接并退出
				// Parent canceled: close connection and exit.
				ticker.Stop()
				_ = m.serverTCP.Stop()
				m.logger.Infof("modbus simulator(TCP) poller exit on ctx done")
				return
			case <-ticker.C:
				time.Sleep(time.Second)
				// 轮询读寄存器 / poll holding/input registers.

				//m.cfg.Model.BytesReceived = m.cfg.Model.BytesReceived + 1
				//m.cfg.Model.BytesSent = m.cfg.Model.BytesSent + 1

				// 打印调试信息 / log debug values.
				m.logger.Debugf("modbus simulator(TCP) recv ok")
			}
		}
	}
}
