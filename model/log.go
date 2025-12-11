package model

import "time"

type Log struct {
	UUID      string `gorm:"primaryKey;column:uuid;size:36;uniqueIndex;not null" json:"uuid"`
	LogType   string
	User      string    //
	Desc      string    //
	CreatedAt time.Time `json:"created_at"`
}

// TableName 用来显式指定表名（可选）
func (Log) TableName() string {
	return "log"
}
