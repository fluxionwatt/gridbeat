# GridBeat

[![GitHub Release](https://img.shields.io/github/release/fluxionwatt/gridbeat?color=brightgreen&label=Release)](https://github.com/fluxionwatt/gridbeat/releases)

English | [简体中文](./README-CN.md)

GridBeat is an open-source data acquisition and monitoring software designed for energy sectors such as photovoltaics (PV) and energy storage systems (ESS).Acting as a data aggregation hub, it enables the collection, protocol conversion, storage, and management of sensor data reported by a wide range of devices, including PV inverters, Power Conversion Systems (PCS), Energy Storage Systems (ESS), environmental monitors, smart meters, box-type transformers, and EV charging piles. It provides highly efficient monitoring and maintenance capabilities through a web interface (including APIs).

### Key Functions

- Data Aggregation: Collects real-time data from inverters, sensors, and other components.
- Multi-Protocol Access Support: Supports protocols including Modbus-TCP, Modbus-RTU, etc.
- Northbound Protocol Support: Supports protocols such as IEC 60870-5-104 and MQTT, facilitating integration with third-party management systems.
- Edge-Native Real-Time Capabilities: Leverages low-latency edge networks to run applications with real-time processing power.
- Modular Design: Features a loosely-coupled modular architecture, allowing for functional expansion via pluggable modules.
- HTTP API: Provides HTTP API interfaces for seamless system integration.

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

### [Modbus TCP Data Collection and MQTT Transmission](https://www.fluxionwatt.com/gridbeat/en_US/quick-start/quick-start.html)

## Get Involved

## Thanks list

* [github.com/simonvetter/modbus](https://github.com/simonvetter/modbus) for modbus (thanks!)
* [github.com/emqx/neuron](https://github.com/emqx/neuron) for modbus gateway design (thanks!)

## License

See [LICENSE](./LICENSE).
