import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'


export interface Channel {
      id: number,
      delay: number,
      debug_log: boolean,
      debug_expiry: string,
      verify_header: boolean,
      onnect_timeout: number,
      down_grade: boolean,
      retry_max: number,
      retry_interval: number,
      endianness: number,
      word_order: number,
      send_interval: number,
      physical_link: string
      uuid: string,
      disable: boolean,
      plugin: string
      device: string
      device2: string
      stop_bits: number,
      speed: number,
      data_bits: number,
      parity: number,
      AddrStart: boolean,
      TCPIPAddr: string
      TCPPort: number,
      BackupTCPIPAddr: string
      BackupTCPPort: number,
      created_at: string,
      updated_at: string,
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}
