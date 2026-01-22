# Frequently asked questions and troubleshooting

## After compiling and starting GridBeat, open page 404

### Check whether the port is open

By default, GridBeat opens port 8080 and executes the following command to check the status of port 8080:
```bash
$ lsof -i:8080
```
If there is no output, it indicates that the port number is not enabled. Execute the following command to open the port:
To view firewall status:
```bash
$ firewall-cmd --state
```
If the returned message is```not running```, you must first enable the firewall:
```bash
$ systemctl start firewalld.service
```
Open the specified port:
```bash
$ firewall-cmd --zone=public --add-port=8080/tcp --permanent
```
Restart the firewall:
```bash
$ systemctl restart firewalld.service
```
Reload firewall:
```bash
$ firewall-cmd --reload
```
```Success``` indicates success. After completion, restart GridBeat.

### Check whether the IP is input correctly

The gridbeat access format is http://x.x.x.x:8080 Where x.x.x.x represents the gateway address where GridBeat is installed. Execute the following command to view the IP address:
```bash
$ ifconfig
```
Check whether the address after inet under the network card matches the entered address.