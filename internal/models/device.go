package models

import (
	"time"

	"github.com/fluxionwatt/gridbeat/utils/point"
	"gorm.io/gorm"
)

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
	ChannelID string
	Channel   Channel `gorm:"references:UUID"`
	//ArrayID         string
	//Array           Array         `gorm:"references:UUID"`
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
