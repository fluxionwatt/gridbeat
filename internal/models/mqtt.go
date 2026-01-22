package models

import (
	"time"

	"gorm.io/gorm"
)

// MQTT 通道
type MQTT struct {
	Base
	ID            string         `gorm:"primaryKey;column:id;size:36;uniqueIndex;not null" json:"id"`
	Delay         time.Duration  `gorm:"column:delay" json:"delay"`                   // 时延 单位 毫秒
	DebugLog      bool           `gorm:"column:debug_log" json:"debug_log"`           // debug log 模式
	DebugExpiry   time.Time      `gorm:"column:debug_expiry" json:"debug_expiry"`     // debuglog 截止时间
	OnnectTimeout time.Duration  `gorm:"column:onnect_timeout" json:"onnect_timeout"` // 连接超时时间 (ms)，默认 3s
	Downgrade     bool           `gorm:"column:down_grade" json:"down_grade"`         // 设备降级
	RetryMax      uint64         `gorm:"column:retry_max" json:"retry_max"`           // 最大重试次数,发送读指令失败后最大重试次数
	RetryInterval time.Duration  `gorm:"column:retry_interval" json:"retry_interval"` // 指令重新发送间隔 (ms)
	Disable       bool           `gorm:"column:disable" json:"disable"`               // disable
	Plugin        string         `gorm:"column:plugin;size:128;not null" json:"plugin"`
	TCPIPAddr     string         `gorm:"column:tcp_ip_addr" json:"tcp_ip_addr"`
	TCPPort       uint16         `gorm:"column:tcp_port" json:"tcp_port"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	Status        InstanceStatus `gorm:"-" json:"status"`
}

// TableName 用来显式指定表名（可选）
func (MQTT) TableName() string {
	return "mqtt"
}

func (c *MQTT) BeforeCreate(tx *gorm.DB) error { return nil }
func (c *MQTT) AfterCreate(tx *gorm.DB) error  { return nil }

func (c *MQTT) BeforeUpdate(tx *gorm.DB) error { return nil }
func (c *MQTT) AfterUpdate(tx *gorm.DB) error  { return nil }

func (c *MQTT) BeforeDelete(tx *gorm.DB) error { return nil }
func (c *MQTT) AfterDelete(tx *gorm.DB) error  { return nil }

func (c *MQTT) BeforeSave(tx *gorm.DB) error { return nil } // create & update 都会走
func (c *MQTT) AfterSave(tx *gorm.DB) error  { return nil } // create & update 都会走
