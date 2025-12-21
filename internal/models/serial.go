package models

import (
	"time"

	"github.com/fluxionwatt/gridbeat/utils/modbus"
)

// Serial represents a serial device record / Serial 表示一个串口设备记录
type Serial struct {
	ID            uint          `gorm:"primaryKey;autoIncrement" json:"id"`          // ID is auto-increment primary key / 自增主键
	Device        string        `gorm:"uniqueIndex;size:256;not null" json:"device"` // Device is like "/dev/ttyUSB0" / 设备路径，例如 "/dev/ttyUSB0"
	Delay         time.Duration `gorm:"column:delay;not null" json:"delay"`          // 时延 单位 毫秒
	DebugLog      bool          `gorm:"column:debug_log" json:"debug_log"`           // debug log 模式
	DebugExpiry   time.Time     `gorm:"column:debug_expiry" json:"debug_expiry"`     // debuglog 截止时间
	VerifyHeader  bool          `gorm:"column:verify_header" json:"verify_header"`   // 校验报文头
	OnnectTimeout time.Duration `gorm:"column:onnect_timeout" json:"onnect_timeout"` // 连接超时时间 (ms)，默认 3s
	Downgrade     bool          `gorm:"column:down_grade" json:"down_grade"`         // 设备降级
	RetryMax      uint64        `gorm:"column:retry_max" json:"retry_max"`           // 最大重试次数,发送读指令失败后最大重试次数
	RetryInterval time.Duration `gorm:"column:retry_interval" json:"retry_interval"` // 指令重新发送间隔 (ms)
	Endianness    uint          `gorm:"column:endianness" json:"endianness"`         // endianness
	WordOrder     uint          `gorm:"column:word_order" json:"word_order"`         // word ordering
	SendInterval  time.Duration `gorm:"column:send_interval" json:"send_interval"`   //指令发送间隔 (ms)
	StopBits      uint          `gorm:"column:stop_bits" json:"stop_bits"`           // 停止位
	Speed         uint          `gorm:"column:speed" json:"speed"`                   // speed
	DataBits      uint          `gorm:"column:data_bits" json:"data_bits"`           // data bits
	Parity        uint          `gorm:"column:parity" json:"parity"`                 // parity
	Disable       bool          `gorm:"column:disabe" json:"disable"`                // disable
	CreatedAt     time.Time     `json:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at"`
}

// TableName 指定表名 / TableName specifies table name.
func (Serial) TableName() string { return "serial" }

func GetSerialDefaultRow(device string) *Serial {
	return &Serial{
		Device:        device,
		Delay:         300 * time.Millisecond,
		DebugLog:      false,
		DebugExpiry:   time.Now(),
		VerifyHeader:  false,
		Speed:         19200,
		OnnectTimeout: 300 * time.Millisecond,
		Downgrade:     false,
		RetryMax:      3,
		RetryInterval: 300 * time.Millisecond,
		Endianness:    uint(modbus.LITTLE_ENDIAN),
		WordOrder:     uint(modbus.LOW_WORD_FIRST),
		SendInterval:  300 * time.Millisecond,
		StopBits:      2,
		DataBits:      8,
		Parity:        modbus.PARITY_NONE,
		Disable:       false,
	}
}
