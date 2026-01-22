import type { Channel } from '~/types'

const channels: Channel[] = [{
      "id": 2,
      "delay": 300000000,
      "debug_log": false,
      "debug_expiry": "2026-01-08T22:25:17.275757+08:00",
      "verify_header": false,
      "onnect_timeout": 300000000,
      "down_grade": false,
      "retry_max": 3,
      "retry_interval": 300000000,
      "endianness": 2,
      "word_order": 2,
      "send_interval": 300000000,
      "physical_link": "serial",
      "uuid": "035b0a77-a270-45b4-b9fc-cf8761d5251d",
      "disable": false,
      "plugin": "mbus",
      "device": "/dev/ttys004",
      "device2": "/dev/ttys007",
      "stop_bits": 2,
      "speed": 19200,
      "data_bits": 8,
      "parity": 0,
      "AddrStart": false,
      "TCPIPAddr": "localhost",
      "TCPPort": 5502,
      "BackupTCPIPAddr": "localhost",
      "BackupTCPPort": 5502,
      "created_at": "2026-01-08T22:25:17.275772+08:00",
      "updated_at": "2026-01-08T22:25:17.275772+08:00",
}]

export default eventHandler(async () => {
  return {
    code: 0,
    message: "ok",
    data: channels,
  }
})
