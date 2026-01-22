# GridBeat

[![GitHub Release](https://img.shields.io/github/release/fluxionwatt/gridbeat?color=brightgreen&label=Release)](https://github.com/fluxionwatt/gridbeat/releases)

[English](./README-EN.md) | 简体中文

GridBeat 是一款开源的用于光伏、储能等能源领域的数据采集与监控软件。它作为数据的汇聚中心，能够采集、转换协议、存储和管理来自众多光伏逆变器、PCS、储能（ESS）、环境监测仪、电表、箱变、充电桩等设备上报的传感器数据，并通过 web 界面（包含 API）实现高效的监控和维护。

### 重要特性
- 数据聚合：从逆变器、储能等传感器和其他组件收集实时数据；
- 多协议接入支持：包括 modbus-TCP、modbus-RTU 等；
- 北向协议支持：包括 IEC104、MQTT、ModBus、Goose 等，方便接入三方管理系统；
- 具有实时能力的边缘原生应用程序可以利用边缘端的低延迟网络；
- 模块化设计：松耦合模块化架构设计，通过可插拔模块扩展更多功能；
- HTTP API：提供 HTTP API 接口用于系统整合；

## 快速开始

gridbeat 管理面板的默认登陆账号为 `root`，密码为 `admin`。

### 下载 gridbeat 运行

选择 [Relase](https://github.com/fluxionwatt/gridbeat/releases) 版本下载

```bash
$ tar xvzf gridbeat-v1.0.0-linux-amd64.tar.gz
$ cd gridbeat-v1.0.0-linux-amd64
$ ./gridbeat server -c config/gridbeat.yml
```

浏览器中打开 `http://localhost:8080` 访问 gridbeat

### 源代码编译

#### 构建工具安装（MAC平台）

```bash
brew install go node
brew go-task goreleaser
```

#### 构建工具安装（Linux 平台）

##### （Linux/AARCH64 平台）

```bash
# 安装 go（1.25 版本以上）
curl -L https://mirrors.aliyun.com/golang/go1.25.5.linux-arm64.tar.gz | tar xvz -C /usr/local/

# 安装 node（25.X 版本以上）
curl -L https://mirrors.cloud.tencent.com/nodejs-release/v25.2.1/node-v25.2.1-linux-arm64.tar.gz | tar xvz -C /usr/local/ --strip-components=1
```

##### （Linux/X86_64 平台）

```bash
# 安装 go（1.25 版本以上）
curl -L https://mirrors.aliyun.com/golang/go1.25.5.linux-amd64.tar.gz | tar xvz -C /usr/local/

# 安装 node（25.X 版本以上）
curl -L https://mirrors.cloud.tencent.com/nodejs-release/v25.2.1/node-v25.2.1-linux-x64.tar.gz | tar xvz -C /usr/local/ --strip-components=1
```

```bash
# 设置 go 环境
cat > /etc/profile.d/go.sh << 'EOF'
# Go environment (system-wide)
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH="$PATH:$GOROOT/bin:$GOPATH/bin"
export GOPROXY=https://goproxy.cn,direct
EOF

chmod +x /etc/profile.d/go.sh
source /etc/profile.d/go.sh

# 安装构建工具 go-task、goreleaser
go install github.com/go-task/task/v3/cmd/task@latest
go install github.com/goreleaser/goreleaser/v2@latest
```

#### 编译

```bash
# 下载源代码
git clone https://github.com/fluxionwatt/gridbeat

# 启动构建
cd gridbeat && task build
```

#### rpm 构建

```bash
goreleaser release --clean --snapshot --skip=publish --skip=announce
```

### Docker

```bash
docker run -d --name gridbeat -p 8080:8080 fluxionwatt/gridbeat:1.0.0
```

### [采集 Modbus TCP 数据并通过 MQTT 发送](./docs/quick_start/quick_start_cn.md)

## 社区

## 感谢

* [github.com/simonvetter/modbus](https://github.com/simonvetter/modbus) for modbus (thanks!)
* [github.com/emqx/neuron](https://github.com/emqx/neuron) for modbus gateway design (thanks!)

## 开源许可

详见 [LICENSE](./LICENSE)。
