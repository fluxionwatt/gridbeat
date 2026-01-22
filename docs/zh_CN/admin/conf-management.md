# 配置管理

GridBeat 支持通过`命令行`、`环境变量`、`配置文件`的方式，对GridBeat的配置参数进行修改，可以提供更加灵活的启动和运行方式。
如果同时配置了`命令行`、`环境变量`、`配置文件`，三者的优先级关系为：命令行 > 环境变量 > 配置文件

## 命令行

```bash
GridBeat is an open-source software for data acquisition and monitoring 
                of solar photovoltaic systems, energy storage systems, and charging piles.

Usage:
  gridbeat [command]

Available Commands:
  help           Help about any command
  reset-password reset the admin password
  server         run server
  simulator      Run Modbus simulator
  version        Print the version number

Flags:
  -c, --config string    config file (default is $PWD/gridbeat.yaml)
      --debug            debug mode
  -h, --help             help for gridbeat
      --plugins string   directory from which loads plugin lib files (default "./plugins")

Use "gridbeat [command] --help" for more information about a command.
```

## 环境变量

GridBeat 支持在启动过程中读取环境变量来配置启动参数，目前支持的环境变量如下:

| 配置名                  | 配置作用                                                                      |
| ---------------------- | --------------------------------------------------------------------------- |
| GRIDBEAT_DAEMON          | 设置为1，GridBeat 守护进程运行；设置为0，GridBeat 正常运行                             |
| GRIDBEAT_LOG             | 设置为1，GridBeat Log输出到标准输出stdout；设置为0，GridBeat Log不输出到标准输出stdout； |
| GRIDBEAT_LOG_LEVEL       | GridBeat日志输出等级，可设置为DEBUG或NOTICE                                        |
| GRIDBEAT_RESTART         | GridBeat重启设置，可设置为never，always，on-failure或者NUMBER（1,2,3,4）            |
| GRIDBEAT_DISABLE_AUTH    | 设置为1，关闭Token鉴权认证；设置为0，开启Token鉴权认证                |
| GRIDBEAT_CONFIG_DIR     | 配置文件路径                                                             |
| GRIDBEAT_PLUGIN_DIR      | 插件文件目录                                                             |
| GRIDBEAT_SUB_FILTER_ERROR | 设置为 1，subscribe 属性的点位仅检测上次读取正常的值，北向不上报任何错误代码 |


## 配置文件

GridBeat 提供 YAML 格式配置文件配置 GridBeat 相关个性化参数，配置文件路径为 gridbeat 安装目录 config/gridbeat.yaml。默认配置内容如下:
```yaml
debug: true
log-path: ./log
data-path: ./data
extra-path: ./extra
pid: gridbeat.pid
mqtt:
    port: 1883
    host: localhost
http:
    port: 8080
    redirect_https: false
https:
    disable: false
    port: 8443
```
