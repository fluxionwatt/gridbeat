package models

import "time"

// Serial represents a serial device record / Serial 表示一个串口设备记录
type Serial struct {
	ID            uint          `gorm:"primaryKey;autoIncrement" json:"id"`          // ID is auto-increment primary key / 自增主键
	Device        string        `gorm:"uniqueIndex;size:256;not null" json:"device"` // Device is like "/dev/ttyUSB0" / 设备路径，例如 "/dev/ttyUSB0"
	Delay         time.Duration `gorm:"column:delay;not null" json:"delay"`          // 时延 单位 毫秒
	DebugLog      bool          `gorm:"column:debug_log" json:"debug_log"`
	VerifyHeader  bool          // 校验报文头
	OnnectTimeout time.Duration // 连接超时时间 (ms)，默认 3s
	Downgrade     bool          // 设备降级
	RetryMax      uint64        // 最大重试次数,发送读指令失败后最大重试次数
	RetryInterval time.Duration // 指令重新发送间隔 (ms)
	ByteOrder4    string        // 4 字节数据字节序
	ByteOrder8    string        // 8 字节数据字节序
	SendInterval  time.Duration //指令发送间隔 (ms)
	StopBits      uint
	Speed         uint
	DataBits      uint
	Parity        uint
	Disable       bool
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// TableName 指定表名 / TableName specifies table name.
func (Serial) TableName() string { return "serial" }
