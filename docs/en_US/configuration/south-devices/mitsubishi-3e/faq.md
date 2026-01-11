# FAQ

## Even though the device is reachable via ping, GridBeat reports a disconnected status.

Under PLC TCP mode, remember that each network port supports only one TCP connection. Therefore, it's crucial to ascertain that a single, unique GridBeat instance is the only entity accessing the PLC via this particular port. 

