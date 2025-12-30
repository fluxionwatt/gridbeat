// src/api/settings.ts
import axios from 'axios'

export type Locale = 'zh-CN' | 'en' | 'ja'

export interface BasicSettings {
  name: string
  timezone: string

  // 是否对时（true: NTP 对时；false: 手动设置）
  timeSyncEnabled: boolean

  // 对时为 NTP 时使用
  ntpServer: string

  // 对时为手动时使用（建议 ISO 字符串）
  manualDateTime: string

  description: string
  defaultLocale: Locale
  sessionTimeoutMinutes: number
  remoteManageEnabled: boolean
}

const MOCK_BASIC_KEY = 'mock_basic_settings'
const mockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 检测当前运行环境支持的全部时区。
 * 现代浏览器支持 Intl.supportedValuesOf('timeZone')，
 * 可以直接拿到一整套 IANA 时区列表。
 */
function detectAllTimezones(): string[] {
  if (typeof Intl !== 'undefined' && (Intl as any).supportedValuesOf) {
    try {
      return (Intl as any).supportedValuesOf('timeZone') as string[]
    } catch (e) {
      console.warn('Intl.supportedValuesOf(timeZone) error, fallback to small list', e)
    }
  }

  // 万一运行环境不支持，就给一个兜底的简短列表
  return [
    'UTC',
    'Asia/Shanghai',
    'Asia/Phnom_Penh',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
  ]
}

// ⭐ 默认时区列表：在 mock 或接口失败时使用
const defaultTimezones = detectAllTimezones()

// 默认配置（用于 mock & 兜底）
const defaultBasicSettings: BasicSettings = {
  name: '工业网关-001',
  timezone: 'Asia/Phnom_Penh',

  timeSyncEnabled: true,
  ntpServer: 'ntp.aliyun.com',
  manualDateTime: '',

  description: '',
  defaultLocale: 'zh-CN',
  sessionTimeoutMinutes: 30,
  remoteManageEnabled: true,
}

// 获取时区列表（真实接口 + mock）
export async function getTimezones(): Promise<string[]> {
  if (mockEnabled) {
    // mock 模式：直接返回运行环境支持的全部时区列表
    return Promise.resolve(defaultTimezones)
  }

  try {
    const { data } = await axios.get<string[]>('/api/settings/timezones')
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
    return defaultTimezones
  } catch (e) {
    console.warn('getTimezones failed, fallback to default list', e)
    return defaultTimezones
  }
}

// 获取基本设置（真实接口 + mock）
export async function getBasicSettings(): Promise<BasicSettings> {
  if (mockEnabled) {
    const raw = localStorage.getItem(MOCK_BASIC_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<BasicSettings>
        return { ...defaultBasicSettings, ...parsed }
      } catch {
        return defaultBasicSettings
      }
    }
    return defaultBasicSettings
  }

  const { data } = await axios.get<Partial<BasicSettings>>('/api/settings/basic')
  return {
    ...defaultBasicSettings,
    ...data,
  }
}

// 保存基本设置（真实接口 + mock）
export async function saveBasicSettings(payload: BasicSettings): Promise<void> {
  if (mockEnabled) {
    localStorage.setItem(MOCK_BASIC_KEY, JSON.stringify(payload))
    return
  }

  await axios.post('/api/settings/basic', payload)
}