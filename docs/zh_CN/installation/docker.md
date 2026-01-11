# Docker 运行

## 获取镜像

:::tip
当前 docker 版本在计划中，很快会到来。
:::

GridBeat docker 镜像请从 [docker hub](https://hub.docker.com/r/fluxionwatt/gridbeat/tags) 网站下载。

```bash
## pull GridBeat
$ docker pull fluxionwatt/gridbeat:latest
```

支持更小占用的 alpine 镜像，请从 [docker hub](https://hub.docker.com/r/fluxionwatt/gridbeat/tags) 网站下载。

```bash
## pull GridBeat
$ docker pull fluxionwatt/gridbeat:2.5.3-alpine
```

## 启动

```bash
## run GridBeat
$ docker run -d --name gridbeat --log-opt max-size=100m -p 7000:7000 --privileged=true -v /host/dir:/opt/gridbeat/persistence --device /dev/ttyUSB0:/dev/ttyS0 --restart=always fluxionwatt/gridbeat:latest
```

* tcp 7000：用于访问 web 和 http api 端口。
* --restart=always：docker 进程重启时，自动重启 gridbeat 容器。
* --privileged=true：可选参数，便于排查问题。
* --env DISABLE_AUTH=1：可选参数，用于关闭鉴权。
* -v /host/dir:/opt/gridbeat/persistence：用于将 docker 中 GridBeat 配置信息存放在本地目录（例如，/host/dir 放在 /opt/gridbeat/persistence）。
* --device /dev/ttyUSB0:/dev/ttyS0：用于映射串口到 docker。/dev/ttyUSB0 是 Linux 下串口设备；/dev/ttyS0 是 Docker 下串口设备。
* --ulimit nofile=65535：默认为 1024，当连接设备较多时增大此字段的值，例如 65535。
* --log-opt：限制 docker 标准输出(stdout)的大小（例如，--log-opt max-size=100m）。
