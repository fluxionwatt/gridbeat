package model

import (
	"time"

	"github.com/fluxionwatt/gridbeat/utils/point"
	"gorm.io/gorm"
)

// Channel 通道
type Channel struct {
	Plugin          string        `gorm:"column:plugin;size:128;not null" json:"plugin"`
	UUID            string        `gorm:"primaryKey;column:uuid;size:36;uniqueIndex;not null" json:"uuid"`
	Name            string        `gorm:"column:name;size:150;uniqueIndex;not null" json:"name"`
	Delay           time.Duration `gorm:"column:delay;not null" json:"delay"` // 时延 单位 毫秒
	URL             string        `gorm:"column:url;size:128;not null" json:"url"`
	DebugLog        bool          `gorm:"column:debug_log" json:"debug_log"`
	PhysicalLink    string        // serial、RTUclient、RTUserver、TCPclient、TCPserver
	VerifyHeader    bool          // 校验报文头
	OnnectTimeout   time.Duration // 连接超时时间 (ms)，默认 3s
	Downgrade       bool          // 设备降级
	RetryMax        uint64        // 最大重试次数,发送读指令失败后最大重试次数
	RetryInterval   time.Duration // 指令重新发送间隔 (ms)
	ByteOrder4      string        // 4 字节数据字节序
	ByteOrder8      string        // 8 字节数据字节序
	AddrStart       bool
	SendInterval    time.Duration //指令发送间隔 (ms)
	SerialName      string
	StopBits        uint
	Speed           uint
	DataBits        uint
	Parity          uint
	TCPIPAddr       string
	TCPPort         uint16
	BackupTCPIPAddr string
	BackupTCPPort   uint16
	Disable         bool
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
	Working         bool          `gorm:"-" json:"working"`       // 工作状态
	Linking         bool          `gorm:"-" json:"linking"`       // 连接状态
	CurrentDelay    time.Duration `gorm:"-" json:"current_delay"` // 当前采集延迟
	BytesSent       uint64        `gorm:"-" json:"bytes_sent"`
	BytesReceived   uint64        `gorm:"-" json:"bytes_received"`
	PointsToalRead  uint64        `gorm:"-" json:"points_total_read"` // 点位读取数总计
	PointsErrorRead uint64        `gorm:"-" json:"points_error_read"` // 点位读取错误数总计
}

// TableName 用来显式指定表名（可选）
func (Channel) TableName() string {
	return "channel"
}

type RegType string

const (
	RegHolding  RegType = "holding"  // 0x03 / 0x06 / 0x10
	RegInput    RegType = "input"    // 0x04
	RegCoil     RegType = "coil"     // 0x01 / 0x05 / 0x0F
	RegDiscrete RegType = "discrete" // 0x02
)

type RegDataType string

const (
	RegU16     RegDataType = "u16"
	RegS16     RegDataType = "s16"
	RegU32     RegDataType = "u32"
	RegS32     RegDataType = "s32"
	RegFloat32 RegDataType = "float32"
	RegFloat64 RegDataType = "float64"
	RegBitMask RegDataType = "bitmask"
)

type RegAccess string

const (
	RegRO RegAccess = "RO"
	RegRW RegAccess = "RW"
	RegWO RegAccess = "WO"
)

type DevicePoint struct {
	UUID string `gorm:"primaryKey;column:uuid;size:36;uniqueIndex;not null" json:"uuid"`
	point.Point
	Raw       []uint16  `gorm:"-" json:"raw,omitempty"`   // 运行时的原始寄存器值
	Value     any       `gorm:"-" json:"value,omitempty"` // 解码后的业务值（已经按 Gain/Offset 换算）
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Channel 用来显式指定表名（可选）
func (DevicePoint) TableName() string {
	return "device_point"
}

type Device struct {
	ChannelID       string
	Channel         Channel `gorm:"references:UUID"`
	ArrayID         string
	Array           Array         `gorm:"references:UUID"`
	DevicePoint     string        // 设备点位
	UUID            string        `gorm:"primaryKey;column:uuid;size:36;uniqueIndex;not null" json:"uuid"`
	Name            string        `gorm:"column:name;size:150;uniqueIndex;not null" json:"name"`
	SN              string        `gorm:"column:sn;size:128;not null" json:"sn"`
	DeviceType      string        `gorm:"column:device_type;size:128;not null" json:"device_type"`
	DevicePlugin    string        `gorm:"column:device_plugin;size:128;not null" json:"device_plugin"`
	SoftwareVersion string        `gorm:"column:software_version;size:128;not null" json:"software_version"`
	Model           string        `gorm:"column:model;size:128;not null" json:"model"`
	Disable         bool          `gorm:"column:disable;size:128;not null" json:"disable"`
	PontsInterval   time.Duration //点位间隔
	PontsGroup      string
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index"`
	DisplayName     string         `gorm:"-" json:"display_name"`
	Online          bool           `gorm:"-" json:"online"`
}

// TableName 用来显式指定表名（可选）
func (Device) TableName() string {
	return "device"
}

type RegisterDef struct {
	Addr     uint16  // Modbus 地址（手册里的 Address）
	Quantity uint16  // Quantity
	Name     string  // 信号名（用于调试）
	T        string  // 寄存器类型
	Gain     float64 // 文档里的 Gain
	Unit     string  // 单位（V, A, kWh, %...）
	RW       string  // RO / RW / WO
	Desc     string
}

func GetDevice() []Device {
	var ds []Device

	result := Gdb.Preload("Channel").Preload("DevicePoint").Find(&ds)
	if result.Error != nil {
		// Handle error
		return ds
	}

	return ds
}

func GetChannel() []Channel {
	var ds []Channel

	result := Gdb.Find(&ds)
	if result.Error != nil {
		// Handle error
		return ds
	}

	return ds
}
