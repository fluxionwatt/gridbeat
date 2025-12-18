package main

import (
	"github.com/fluxionwatt/gridbeat/pluginapi"
	"github.com/fluxionwatt/gridbeat/plugins/goose"
)

// 导出符号 Factory，类型为 pluginapi.Factory
// Export symbol "Factory" of type pluginapi.Factory.
// plugin.Lookup("Factory") 将返回 *pluginapi.Factory（指向该变量的指针）
// plugin.Lookup("Factory") will return *pluginapi.Factory (pointer to this variable).
var Factory pluginapi.Factory = &goose.GooseFactory{}
