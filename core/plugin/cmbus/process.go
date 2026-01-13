package cmbus

import (
	"fmt"
	"os"
	"os/exec"
)

func process(device string, device2 string) {

	cmd := exec.Command(fmt.Sprintf("socat -d -d pty,raw,echo=0,link=%s pty,raw,echo=0,link=%s", device, device2))

	// Set environment variables
	//cmd.Env = append(cmd.Env, "MY_VAR=some_value")

	// Redirect standard output to the parent process's output
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
}
