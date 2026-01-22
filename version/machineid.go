package version

import (
	"github.com/denisbrodbeck/machineid"
)

var MachineID string

func init() {
	var err error
	MachineID, err = machineid.ID()
	if err != nil {
		panic(err)
	}
}
