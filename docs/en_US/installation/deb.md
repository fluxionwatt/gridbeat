# Using deb package

## Download

Download the installation package according to different versions and architectures, E.g.

```bash
$ wget https://github.com/fluxionwatt/gridbeat/releases/download/v1.0.0/gridbeat-1.0.0-x86_64.deb
```

## Install

Install according to different versions and architectures, E.g.

```bash
$ sudo dpkg -i gridbeat-1.0.0-x86_64.deb
```

To avoid replacing the gridbeat package due to the ubuntu system perform the package updated automatically, you also need to execute the following command to keep the gridbeat package in the apt upgrade.

```bash
$ sudo apt-mark hold gridbeat
```

::: tip
After successful installation of the deb package, GridBeat is automatically started.
:::

## Status

```bash
$ sudo systemctl status gridbeat
```

## Stop

```bash
$ sudo systemctl stop gridbeat
```

## Restart GridBeat

```bash
$ sudo systemctl restart gridbeat
```

## Uninstall

```bash
$ sudo dpkg -r gridbeat
```