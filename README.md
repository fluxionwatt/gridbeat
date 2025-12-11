# GridBeat

[![GitHub Release](https://img.shields.io/github/release/fluxionwatt/gridbeat?color=brightgreen&label=Release)](https://github.com/fluxionwatt/gridbeat/releases)

English | [简体中文](./README-CN.md)

GridBeat is an open-source software for data acquisition and monitoring of solar photovoltaic systems, energy storage systems, and charging piles. As a data aggregation center, it collects, converts protocols, stores, and manages sensor data reported from numerous inverters, ESS devices, charging piles, and other equipment. It enables efficient monitoring and maintenance through a web interface (including an API). The GridBeat Box reference design, based on Nexus, can connect up to 1024 devices, supports multiple communication protocols (Modbus-TCP/RTU, 4G/3G/WAN/LAN), is easy to install, and can operate stably in various environments.

Key Functions

## Quick Start

Default username is `root` and password is `admim`.

### Download

You can download from [Release](https://github.com/fluxionwatt/gridbeat/releases).

```bash
# Create dependency directories (config is the configuration file directory, log is the log file directory, data is the data file directory, and extra is the extended data directory).
$ mkdir -p gridbeat/{config,log,data,extra}
$ tar xvzf gridbeat-linux-amd64.tar.gz -C gridbeat/
$ cd gridbeat
$ ./gridbeat server
```

Open a web browser and navigate to `http://localhost:8080` to access the Web interface.

### Build

```bash
# Before starting, ensure that you have Go (version 1.25 or higher) and npm (version 25.X or higher) installed.
# setup build tool

brew install go-task/tap/go-task
brew install go-task

# source code
$ git clone https://github.com/fluxionwatt/gridbeat

# start build
$ cd gridbeat && task build
```

### Docker

```bash
$ docker run -d --name gridbeat -p 8080:8080 fluxionwatt/gridbeat:1.0.0
```

### [Modbus TCP Data Collection and MQTT Transmission](./docs/quick_start/quick_start.md)

## Get Involved

## Thanks list

* [github.com/simonvetter/modbus](https://github.com/simonvetter/modbus) for modbus (thanks!)
* [github.com/emqx/neuron](https://github.com/emqx/neuron) for modbus gateway design (thanks!)

## License

See [LICENSE](./LICENSE).
