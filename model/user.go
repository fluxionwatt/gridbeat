package model

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	UUID      string     `gorm:"primaryKey;column:uuid;size:36;uniqueIndex;not null" json:"uuid"`
	UserName  string     `gorm:"column:username;size:150;uniqueIndex;not null" json:"username"`
	Password  string     `gorm:"column:password;size:255;not null" json:"-"` // 存哈希后的密码（类似 Django 的 pbkdf2_sha256$...），不要存明文
	IsActive  bool       `gorm:"not null;default:true" json:"is_active"`     // 是否可登录
	LastLogin *time.Time `json:"last_login"`                                 // 上次登录时间，可为 null
	CreatedAt time.Time  `json:"created_at"`                                 // GORM 自带
	UpdatedAt time.Time  `json:"updated_at"`
}

// TableName 用来显式指定表名（可选）
func (User) TableName() string {
	return "user"
}

func (User) GetInitData() *User {
	now := time.Now()
	d := &User{
		UUID:      uuid.New().String(),
		UserName:  "root",
		Password:  "admin",
		IsActive:  true,
		CreatedAt: now,
		LastLogin: &now,
		UpdatedAt: now,
	}

	return d
}
