package modbus

import (
	"crypto/rand"
	"encoding/binary"
	"fmt"
	"math"
	"time"

	"github.com/fluxionwatt/gridbeat/internal/models"
	modbusutils "github.com/fluxionwatt/gridbeat/utils/modbus"
)

// Coil handler method.
// This method gets called whenever a valid modbus request asking for a coil operation is
// received by the server.
// It exposes 100 read/writable coils at addresses 0-99, except address 80 which is
// read-only.
// (read them with ./modbus-cli --target tcp://localhost:5502 rc:0+99, write to register n
// with ./modbus-cli --target tcp://localhost:5502 wr:n:<true|false>)
func (eh *ModbusInstance) HandleCoils(req *modbusutils.CoilsRequest) (res []bool, err error) {
	//if req.UnitId != 1 {
	// only accept unit ID #1
	// note: we're merely filtering here, but we could as well use the unit
	// ID field to support multiple register maps in a single server.
	//err = modbusutils.ErrIllegalFunction
	//return
	//}

	// make sure that all registers covered by this request actually exist
	if int(req.Addr)+int(req.Quantity) > len(eh.coils) {
		err = modbusutils.ErrIllegalDataAddress
		return
	}

	// since we're manipulating variables shared between multiple goroutines,
	// acquire a lock to avoid concurrency issues.
	eh.lock.Lock()
	// release the lock upon return
	defer eh.lock.Unlock()

	// loop through `req.Quantity` registers, from address `req.Addr` to
	// `req.Addr + req.Quantity - 1`, which here is conveniently `req.Addr + i`
	for i := 0; i < int(req.Quantity); i++ {
		// ignore the write if the current register address is 80
		if req.IsWrite && int(req.Addr)+i != 80 {
			// assign the value
			eh.coils[int(req.Addr)+i] = req.Args[i]
		}
		// append the value of the requested register to res so they can be
		// sent back to the client
		res = append(res, eh.coils[int(req.Addr)+i])
	}

	return
}

// Discrete input handler method.
// Note that we're returning ErrIllegalFunction unconditionally.
// This will cause the client to receive "illegal function", which is the modbus way of
// reporting that this server does not support/implement the discrete input type.
func (eh *ModbusInstance) HandleDiscreteInputs(req *modbusutils.DiscreteInputsRequest) (res []bool, err error) {
	// this is the equivalent of saying
	// "discrete inputs are not supported by this device"
	// (try it with modbus-cli --target tcp://localhost:5502 rdi:1)
	err = modbusutils.ErrIllegalFunction

	return
}

// Holding register handler method.
// This method gets called whenever a valid modbus request asking for a holding register
// operation (either read or write) received by the server.
func (eh *ModbusInstance) HandleHoldingRegisters(req *modbusutils.HoldingRegistersRequest) (res []uint16, err error) {
	var regAddr uint16

	if req.UnitId != 1 {
		// only accept unit ID #1
		//err = modbusutils.ErrIllegalFunction
		//return
	}

	// since we're manipulating variables shared between multiple goroutines,
	// acquire a lock to avoid concurrency issues.
	eh.lock.Lock()
	// release the lock upon return
	defer eh.lock.Unlock()

	// loop through `quantity` registers
	for i := 0; i < int(req.Quantity); i++ {
		// compute the target register address
		regAddr = req.Addr + uint16(i)

		if req.IsWrite {
			eh.holdingReg[regAddr] = req.Args[i]
			s := fmt.Sprintf("recive IsWrite regAddr %v quantity %v unitID %v", regAddr, req.Quantity, req.UnitId)
			eh.logger.Infof(s)
		} else {
			s := fmt.Sprintf("recive regAddr %v quantity %v unitID %v", regAddr, req.Quantity, req.UnitId)
			eh.logger.Infof(s)
		}

		res = append(res, eh.holdingReg[regAddr])
	}

	return
}

// Input register handler method.
// This method gets called whenever a valid modbus request asking for an input register
// operation is received by the server.
// Note that input registers are always read-only as per the modbus spec.
func (eh *ModbusInstance) HandleInputRegisters(req *modbusutils.InputRegistersRequest) (res []uint16, err error) {
	var unixTs_s uint32
	var minusOne int16 = -1

	//if req.UnitId != 1 {
	// only accept unit ID #1
	//	err = modbus.ErrIllegalFunction
	//	return
	//}

	// get the current unix timestamp, converted as a 32-bit unsigned integer for
	// simplicity
	unixTs_s = uint32(time.Now().Unix() & 0xffffffff)

	// loop through all register addresses from req.addr to req.addr + req.Quantity - 1
	for regAddr := req.Addr; regAddr < req.Addr+req.Quantity; regAddr++ {
		switch regAddr {
		case 100:
			// return the static value 0x1111 at address 100, as an unsigned
			// 16-bit integer
			// (read it with modbus-cli --target tcp://localhost:5502 ri:uint16:100)
			res = append(res, 0x1111)

		case 101:
			// return the static value -1 at address 101, as a signed 16-bit
			// integer
			// (read it with modbus-cli --target tcp://localhost:5502 ri:int16:101)
			res = append(res, uint16(minusOne))

		// expose our uptime counter, encoded as a 32-bit unsigned integer in
		// input registers 200-201
		// (read it with modbus-cli --target tcp://localhost:5502 ri:uint32:200)
		case 200:
			// return the 16 most significant bits of the uptime counter
			// (using locking to avoid concurrency issues)
			eh.lock.RLock()
			res = append(res, uint16((eh.uptime>>16)&0xffff))
			eh.lock.RUnlock()

		case 201:
			// return the 16 least significant bits of the uptime counter
			// (again, using locking to avoid concurrency issues)
			eh.lock.RLock()
			res = append(res, uint16(eh.uptime&0xffff))
			eh.lock.RUnlock()

		// expose the current unix timestamp, encoded as a 32-bit unsigned integer
		// in input registers 202-203
		// (read it with modbus-cli --target tcp://localhost:5502 ri:uint32:202)
		case 202:
			// return the 16 most significant bits of the current unix time
			res = append(res, uint16((unixTs_s>>16)&0xffff))

		case 203:
			// return the 16 least significant bits of the current unix time
			res = append(res, uint16(unixTs_s&0xffff))

		// return 3.1415, encoded as a 32-bit floating point number in input
		// registers 300-301
		// (read it with modbus-cli --target tcp://localhost:5502 ri:float32:300)
		case 300:
			// returh the 16 most significant bits of the number
			res = append(res, uint16((math.Float32bits(3.1415)>>16)&0xffff))

		case 301:
			// returh the 16 least significant bits of the number
			res = append(res, uint16((math.Float32bits(3.1415))&0xffff))

		// attempting to access any input register address other than
		// those defined above will result in an illegal data address
		// exception client-side.
		default:
			err = modbusutils.ErrIllegalDataAddress
			return
		}
	}

	return
}

func RandUint16() uint16 {
	var buf [2]byte
	_, _ = rand.Read(buf[:])
	return binary.BigEndian.Uint16(buf[:])
}

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
