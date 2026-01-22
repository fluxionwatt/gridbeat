# Using rpm package

## Download

Download the installation package according to different versions and architectures, E.g.

```bash
$ wget https://github.com/fluxionwatt/gridbeat/releases/download/v1.0.0/gridbeat-1.0.0-x86_64.rpm
```

## Install

Install according to different versions and architectures, E.g.

```bash
$ sudo rpm -ivh gridbeat-1.0.0-x86_64.rpm
```

::: tip
After successful installation of the rpm package, GridBeat is automatically started.
:::

## Status

```bash
$ sudo systemctl status gridbeat
```

## Stop

```bash
$ sudo systemctl stop gridbeat
```

## Restart

```bash
$ sudo systemctl restart gridbeat
```

## Uninstall

```bash
$ sudo rpm -e gridbeat
```