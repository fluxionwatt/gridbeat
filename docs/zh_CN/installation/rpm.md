# 使用 rpm 包安装

## 下载

根据不同版本及架构下载安装包，例如：

```bash
$ wget https://github.com/fluxionwatt/gridbeat/releases/download/v1.0.0/gridbeat-1.0.0-x86_64.rpm
```

## 安装

根据不同版本及架构安装，例如：

```bash
$ sudo rpm -ivh gridbeat-1.0.0-x86_64.rpm
```

::: tip
成功安装 rpm 包后，自启动 GridBeat。
:::

## 状态

```bash
$ sudo systemctl status gridbeat
```

## 停止

```bash
$ sudo systemctl stop gridbeat
```

## 重启

```bash
$ sudo systemctl restart gridbeat
```

## 卸载

```bash
$ sudo rpm -e gridbeat
```