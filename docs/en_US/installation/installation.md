# Installation

GridBeat supports 32-bit/64-bit ARM and 64-bit x86 architectures on Linux-based operating systems and are available in the following installation package formats:

* Debian Software Package (.deb) format for Debian, Ubuntu Linux-based operating systems.

* Redhat Package Manager (.rpm) format for Red Hat, CentOS/Rocky Linux-based operating systems.


## Installation Packages for Linux Distro

| Linux Distribution                                    | Required Package  |
| ------------------------------------------------------------ | ------------------ |
| Ubuntu 20.04 <br>Ubuntu 18.04 <br>Ubuntu16.04<br>Debian 11<br>Debian 10<br>Debian 9<br>Debian 8               | **Debian Software Package** (.deb)         |
| RHEL/CentOS/Rocky 7/8/9/10    | **Redhat Package Manager** (.rpm)         |
| Other Linux | **Tape Archiver** (tar.gz) |

:::tip
The rpm/deb packages installation is recommended for setting up the system service manager (systemd) to monitor the GridBeat running instance.
:::


## Hardware Requirements

GridBeat is fully developed in Go language and supports running on x86, ARM and other hardware architectures as well as container deployment, such as K8s, KubeEdge, etc. On devices with limited hardware resources, it can also achieve data acquisition of 100 ms or even 10 ms level. On servers with sufficient hardware resources, GridBeat can also make full use of multi-core CPUs, and can simultaneously conduct data acquisition and point write control of hundreds of thousands of points at the frequency of 100 ms.

The following table lists the hardware conditions required for the minimum demand of GridBeat at different number of tags.

|Tag Limits|Minimum Memory Recommendation|Hardware Architecture|Remarks|
| :-------------------- | :------------------------------ | :---------------------------------- | :----------------------------------- |
| 100 tags    | 128M memory | 32-bit/64-bit ARM and 64-bit x86 architectures | Raspberry Pi 3 |
| 1,000 tags  | 256M memory | 32-bit/64-bit ARM and 64-bit x86 architectures | Raspberry Pi 4 |
| 10,000 tags | 512M memory | 64-bit ARM and 64-bit x86 architectures | Industrial PC, etc |
| More than 10,000 tags | 1G memory | 64-bit x86 architectures | Powerful Industrial PC, Server, etc |

:::tip
GridBeat has no upper limitation on the number of tags. It depends on the allocated CPU and memory resources. GridBeat is very portable to run on limited resource like single board hardware, or on powerful servers. The following figures are the results of GridBeat performance test for your reference and these benchmark results are still not the upper limits. A more powerful server can be used for more tags.

Platform                         : Intel(R) Xeon(R) Gold 6266C@3.00GHz<br>
Memory                           : 4G<br>
Architecture                     : x86<br>
OS Support                       : Ubuntu 20.04<br>
No. of connections               : 1000 connections<br>
No. of tags for each connection  : 300 tags<br>
Total tags                       : 300,000 tags<br>
Memory Usage                     : 300M<br>
CPU Usage                        : 90%<br>

:::



## Download

GridBeat software packages can be downloaded from [Github](https://github.com/fluxionwatt/gridbeat/releases).

## Debian Software Package

| Download files               | Architecture |
| ---------------------------- | ------------ |
| gridbeat-x.y.z-x86_64.deb | X86_64 |
| gridbeat-x.y.z-linux-armhf.deb | ARM_32 |
| gridbeat-x.y.z-aarch64.deb | ARM_64 |


## Redhat Package Manager

| Download files               | Architecture |
| ---------------------------- | ------------ |
| gridbeat-x.y.z-x86_64.rpm | X86_64 |
| gridbeat-x.y.z-armhf.rpm | ARM_32 |
| gridbeat-x.y.z-aarch64.rpm | ARM_64 |


## Tape Archive

| Download files               | Architecture |
| ---------------------------- | ------------ |
| gridbeat-x.y.z-linux-amd64.tar.gz | X86_64 |
| gridbeat-x.y.z-linux-armhf.tar.gz | ARM_32 |
| gridbeat-x.y.z-linux-arm64.tar.gz | ARM_64 |


## Docker Image

| Download files      | Architecture |
| ------------------- | ------------ |
| gridbeat-x.y.z-alpine | Docker       |


## Build from Source

| Download files                         | Remark        |
| -------------------------------------- | ------------- |
| http://github.com/fluxionwatt/gridbeat | Github Source |

Release number x.y.z have following description:

* x is the major release number: the change in this number means that the software architecture has changed. Therefore, upgrading to a major release does not guarantee compatibility with the previous major release.

* y is the minor release number: the change in this number introduces some new features. Upgrading to a minor release would ensure backward compatibility.

* z is the maintenance release number: this new release number only contains patches, bug fixes, etc.


## License

At present, GridBeat has open source MQTT, RESTful API, IEC104, GOOSE and Modbus RTU/TCP, and users can directly use the open source driver protocols. 

Please refer to [Module List](../introduction/plugin-list/plugin-list.md) for the driver protocols supported by GridBeat.

