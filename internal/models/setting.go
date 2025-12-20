package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Setting 系统配置表
// Setting represents system settings table.
//
// value_json 存放 JSON 原始值：可以是 number/string/bool
// value_type 作为判别字段：int/string/bool
type Setting struct {
	// UUID string primary key
	// UUID 字符串主键
	ID string `json:"id" gorm:"primaryKey;type:char(36)"`

	// Unique key name
	// 唯一配置名
	Name string `json:"name" gorm:"size:128;uniqueIndex;not null"`

	// Discriminator for value type: int|string|bool
	// 值类型判别字段：int|string|bool
	ValueType string `json:"value_type" gorm:"size:16;not null;index"`

	// ValueJSON 存放 JSON 原始值（number/string/bool）
	// Swagger 用 string 展示，实际请求可传 10 / "abc" / true
	ValueJSON datatypes.JSON `json:"value" gorm:"type:json;not null" swaggertype:"primitive,string" example:"true"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName 指定表名 / TableName specifies table name.
func (Setting) TableName() string { return "setting" }

// BeforeCreate 在创建前生成 UUID / generate UUID before insert.
func (s *Setting) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.NewString()
	}
	return nil
}
