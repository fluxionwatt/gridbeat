package main

import (
	"fmt"

	"github.com/fluxionwatt/gridbeat/pluginapi"
)

func init() {
}

// 定义一个实现 Plugin 接口的类型
type GOOSEPlugin struct{}

func (p *GOOSEPlugin) Name() string { return "hello" }

func (p *GOOSEPlugin) Init() error {
	fmt.Println("[hello] plugin init")
	return nil
}

// 必须导出一个全局符号，名字大家约定好，例如 Plugin
var Plugin pluginapi.Plugin = &GOOSEPlugin{}
