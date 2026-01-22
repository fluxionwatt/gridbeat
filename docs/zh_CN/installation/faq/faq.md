# 常见错误说明及排查

## 编译启动 gridbeat 后，打开页面 404

### 检查端口是否开启

gridbeat 默认开启端口 8080，执行以下指令检查端口 8080 状态：

```bash
$ lsof -i:8080
```

如果没有任何输出则说明没有开启该端口号，执行以下指令开启端口：
查看防火墙状态：

```bash
$ firewall-cmd --state
```

如果返回的是 ```not running```， 则须先开启防火墙：

```bash
$ systemctl start firewalld.service
```

开启指定端口：

```bash
$ firewall-cmd --zone=public --add-port=8080/tcp --permanent
```

重启防火墙：

```bash
$ systemctl restart firewalld.service
```

重新加载防火墙：

```bash
$ firewall-cmd --reload
```

显示 success 表示成功，完成后重新启动 gridbeat。

### 检查 ip 是否输入正确

GridBeat 访问格式为 http://x.x.x.x:8080 其中，x.x.x.x 代表安装 GridBeat 的网关地址，执行以下指令查看 ip：

```bash
$ ifconfig
```

核对网卡下 inet 后的地址与所输入地址是否一致。

