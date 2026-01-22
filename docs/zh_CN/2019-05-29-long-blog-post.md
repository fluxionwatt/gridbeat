---
slug: long-blog-post
title: Rocky Linux 9 常用初始化设置
author: TrueNVR 
tags: []
---


在 Rocky Linux 9 上使用阿里云镜像离线的方式安装单机版 Kubernetes（K8s）最新版



# Rocky Linux 9 常用初始化设置

**Rocky Linux 9** 是基于 RHEL 的企业级操作系统，适合用于服务器和开发环境。在安装完 Rocky Linux 9 后，进行一些初始化设置是非常必要的。本文将介绍一些常见的初始化配置步骤，包括系统更新、防火墙配置、网络设置、用户管理等内容，帮助你更好地配置和管理你的系统。

## 1. 系统更新

在开始配置之前，首先需要确保系统是最新的。执行以下命令来更新系统：

```bash
sudo dnf update -y
```
该命令将自动安装所有可用的更新和安全补丁。

## 2. 关闭防火墙

