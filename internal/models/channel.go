package models

import (
	"time"

	"gorm.io/gorm"
)

// Channel 通道
type Channel struct {
	UUID            string        `gorm:"primaryKey;column:uuid;size:36;uniqueIndex;not null" json:"uuid"`
	Plugin          string        `gorm:"column:plugin;size:128;not null" json:"plugin"`
	Delay           time.Duration `gorm:"column:delay;not null" json:"delay"` // 时延 单位 毫秒
	URL             string        `gorm:"column:url;size:128;not null" json:"url"`
	DebugLog        bool          `gorm:"column:debug_log" json:"debug_log"`
	PhysicalLink    string        // serial、RTUclient、RTUserver、TCPclient、TCPserver
	SerialID        uint          // serial ID
	VerifyHeader    bool          // 校验报文头
	OnnectTimeout   time.Duration // 连接超时时间 (ms)，默认 3s
	Downgrade       bool          // 设备降级
	RetryMax        uint64        // 最大重试次数,发送读指令失败后最大重试次数
	RetryInterval   time.Duration // 指令重新发送间隔 (ms)
	AddrStart       bool
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

/*
GORM（v2）里增删改相关的 model hook 主要就是这些（方法签名统一为 func(*gorm.DB) error，返回 error 会中止后续并回滚当前事务）。 ￼

Create（新增）会触发
  - BeforeSave
  - BeforeCreate
  - AfterCreate
  - AfterSave  ￼

Update（修改）会触发
  - BeforeSave
  - BeforeUpdate
  - AfterUpdate
  - AfterSave  ￼

Delete（删除）会触发
  - BeforeDelete
  - AfterDelete  ￼

另外，查询相关还有 AfterFind（不是增删改，但经常一起用）。 ￼
*/

func (c *Channel) BeforeCreate(tx *gorm.DB) error { return nil }
func (c *Channel) AfterCreate(tx *gorm.DB) error  { return nil }

func (c *Channel) BeforeUpdate(tx *gorm.DB) error { return nil }
func (c *Channel) AfterUpdate(tx *gorm.DB) error  { return nil }

func (c *Channel) BeforeDelete(tx *gorm.DB) error { return nil }
func (c *Channel) AfterDelete(tx *gorm.DB) error  { return nil }

func (c *Channel) BeforeSave(tx *gorm.DB) error { return nil } // create & update 都会走
func (c *Channel) AfterSave(tx *gorm.DB) error  { return nil } // create & update 都会走
