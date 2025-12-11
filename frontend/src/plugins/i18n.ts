// src/plugins/i18n.ts
import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import zhCN from '@/locales/zh-CN'
import ja from '@/locales/ja'

// 所有支持的语言，只在这里维护
export const SUPPORTED_LOCALES = ['zh-CN', 'en', 'ja'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

// 统一 messages 对象
const messages = {
  'zh-CN': zhCN,
  en,
  ja,
} as const

// ③ 从 localStorage 读取并做校验
function getInitialLocale(): Locale {
  const saved = localStorage.getItem('locale')
  if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) {
    return saved as Locale
  }
  return 'zh-CN'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages,
})
