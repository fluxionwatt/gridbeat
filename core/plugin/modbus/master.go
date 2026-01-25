package modbus

import (
	"time"

	"github.com/fluxionwatt/gridbeat/internal/models"
)

// runPollerRTU：内部轮询逻辑，在单独协程中运行 internal polling loop, runs in a dedicated goroutine.
func (m *ModbusInstance) runPollerRTU(cfg *models.InstanceConfig) {
	regType := parseRegType("holding")

	m.logger.Infof("modbus poller(RTU) started, interval=%s", cfg.Channel.RetryInterval)

	for {
		// 如果上层 ctx 已取消，直接退出
		// If parent context is done, exit.
		select {
		case <-m.ctx.Done():
			m.logger.Infof("modbus poller(RTU) exit: ctx=%v", m.ctx.Err())
			return
		default:
		}

		m.Status.Working = true
		m.Status.Linking = false

		// 尝试建立连接 / try to open connection.
		if err := m.client.Open(); err != nil {
			m.logger.Errorf("modbus poller(RTU) open %s failed: %v", m.URL, err)
			if !sleepWithContext(m.ctx, 2*time.Second) {
				m.logger.Infof("modbus poller(RTU) exit during reconnect wait")
				return
			}
			continue
		}

		m.logger.Infof("modbus poller(RTU) connected to %s", m.URL)

		m.Status.Linking = true

		ticker := time.NewTicker(cfg.Channel.RetryInterval)
		connected := true

		for connected {
			select {
			case <-m.ctx.Done():
				// 上层取消：关闭连接并退出/Parent canceled: close connection and exit.
				ticker.Stop()
				_ = m.client.Close()
				m.logger.Infof("modbus poller(RTU) exit on ctx done")
				return
			case <-ticker.C:
				// 轮询读寄存器 / poll holding/input registers.
				values, err := m.client.ReadRegisters(100, 1, regType)
				if err != nil {
					m.logger.Errorf("modbus poller(RTU) read %s failed addr=%d qty=%d: %v", m.URL, 100, 1, err)
					// 读失败：关闭连接，跳出内层循环，外层循环负责重连/On read failure: close and let outer loop retry.
					ticker.Stop()
					_ = m.client.Close()
					if !sleepWithContext(m.ctx, 2*time.Second) {
						m.logger.Infof("modbus poller(RTU) exit during reconnect wait")
						return
					}
					connected = false
					break
				}

				m.Status.BytesReceived = m.Status.BytesReceived + 1
				m.Status.BytesSent = m.Status.BytesSent + 1

				// 打印调试信息 / log debug values.
				m.logger.Debugf("modbus poller(RTU) read %s ok addr=%d qty=%d values=%v", m.URL, 100, 1, values)
			}
		}
	}
}

// runPollerTCP：内部轮询逻辑，在单独协程中运行 internal polling loop, runs in a dedicated goroutine.
func (m *ModbusInstance) runPollerTCP(cfg *models.InstanceConfig) {
	regType := parseRegType("input")

	m.logger.Infof("modbus poller(TCP) started, interval=%s", cfg.Channel.RetryInterval)

	for {
		// 如果上层 ctx 已取消，直接退出
		// If parent context is done, exit.
		select {
		case <-m.ctx.Done():
			m.logger.Infof("modbus poller(TCP) exit: ctx=%v", m.ctx.Err())
			return
		default:
		}

		m.Status.Working = true
		m.Status.Linking = false

		// 尝试建立连接 / try to open connection.
		if err := m.client.Open(); err != nil {
			m.logger.Errorf("modbus poller(TCP) open %s failed: %v", m.URL, err)
			if !sleepWithContext(m.ctx, 2*time.Second) {
				m.logger.Infof("modbus poller(TCP) exit during reconnect wait")
				return
			}
			continue
		}

		m.logger.Infof("modbus poller(TCP) connected to %s", m.URL)

		m.Status.Linking = true

		ticker := time.NewTicker(cfg.Channel.RetryInterval)
		connected := true

		for connected {
			select {
			case <-m.ctx.Done():
				// 上层取消：关闭连接并退出
				// Parent canceled: close connection and exit.
				ticker.Stop()
				_ = m.client.Close()
				m.logger.Infof("modbus poller(TCP) exit on ctx done")
				return
			case <-ticker.C:
				// 轮询读寄存器 / poll holding/input registers.
				values, err := m.client.ReadRegisters(
					100,
					1,
					regType,
				)
				if err != nil {
					m.logger.Errorf("modbus poller(TCP) read %s failed addr=%d qty=%d: %v", m.URL,
						100, 1, err)
					// 读失败：关闭连接，跳出内层循环，外层循环负责重连
					// On read failure: close and let outer loop retry.
					ticker.Stop()
					_ = m.client.Close()
					if !sleepWithContext(m.ctx, 2*time.Second) {
						m.logger.Infof("modbus poller(TCP) exit during reconnect wait")
						return
					}
					connected = false
					break
				}

				m.Status.BytesReceived = m.Status.BytesReceived + 1
				m.Status.BytesSent = m.Status.BytesSent + 1

				// 打印调试信息 / log debug values.
				m.logger.Debugf("modbus poller(TCP) read ok addr=%d qty=%d values=%v",
					100, 1, values)
			}
		}
	}
}
