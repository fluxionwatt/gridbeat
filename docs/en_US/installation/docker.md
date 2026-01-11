# Running with Docker

## Get the image

:::tip
The current Docker version is in the planning stages and will be released soon.
:::

The gridbeat docker image can be downloaded from the docker hub website.[docker hub](https://hub.docker.com/r/fluxionwatt/gridbeat)

```bash
## pull GridBeat
$ docker pull fluxionwatt/gridbeat:latest
```

To support the Alpine image with smaller occupation, please download it from the [docker hub](https://hub.docker.com/r/fluxionwatt/gridbeat/tags) website.

```bash
## pull GridBeat
$ docker pull fluxionwatt/gridbeat:2.5.3-alpine
```

## Start

```bash
## run GridBeat
$ docker run -d --name gridbeat --log-opt max-size=100m -p 8080:8080 --privileged=true -v /host/dir:/opt/gridbeat/persistence --device /dev/ttyUSB0:/dev/ttyS0 --restart=always fluxionwatt/gridbeat:latest
```

* tcp 7000: Used to access the web and http api port.
* --restart=always: Automatically restart the gridbeat container when the docker process is restarted.
* --privileged=true: Optional parameter for easy troubleshooting.
* --env DISABLE_AUTH=1: Optional parameter to turn off authentication.
* -v /host/dir:/opt/gridbeat/persistence: Used to store GridBeat configuration information in docker to a local directory, e.g. /host/dir to /opt/gridbeat/persistence.
* --device /dev/ttyUSB0:/dev/ttyS0: Used to map the serial port to docker. /dev/ttyUSB0 // Serial port device under Ubuntu; /dev/ttyS0 // Serial port device under Docker.
* --ulimit nofile=65535: The default value is 1024. When there are many connected devices, increase the value of this field, such as 65535.
* --log-opt: Limit the size of Docker standard output (stdout) (e.g., --log-opt max-size=100m).