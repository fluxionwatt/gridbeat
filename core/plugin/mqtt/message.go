package mqtt

import (
	"encoding/json"
	"log"

	"github.com/fluxionwatt/gridbeat/version"
)

var messageHandlers = make(map[string]func(Data map[string]any) error)

func init() {
	log.Printf("MQTT Message Handler initialized")

	messageHandlers["device/"+version.MachineID] = messageUpdate
}

func messageUpdate(Data map[string]any) error {
	return nil
}

type Message struct {
	T    string         `json:"t"`
	Data map[string]any `json:"data"`
}

func MessageHandler(Topic string, Payload []byte) error {

	var v Message

	if err := json.Unmarshal(Payload, &v); err != nil {
		log.Printf("Error unmarshaling message on topic %s: %v", Topic, err)
		return err
	}

	log.Printf("Received message on topic %s: %+v", Topic, v)

	if handler, exists := messageHandlers[Topic]; exists {
		if err := handler(v.Data); err != nil {
			log.Printf("Error handling message on topic %s: %v", Topic, err)
			return err
		}
	}

	return nil
}
