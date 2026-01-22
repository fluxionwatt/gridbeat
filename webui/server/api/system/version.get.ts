// server/api/system/version.get.ts
import {
  defineEventHandler,
  getQuery,
  getRequestHeader,
  setResponseStatus,
  createError,
} from 'h3'

export type SystemInfo = {
  version: string
  commit: string
  buildTime: string
  serverTime: string
  uptimeSec: number
  mode?: 'mock' | 'real'
}

type ApiResp<T> = { data: T }

function pickEnv(...keys: string[]) {
  for (const k of keys) {
    const v = process.env[k]
    if (v && v.trim()) return v.trim()
  }
  return ''
}

function trimSlashRight(s: string) {
  return s.replace(/\/+$/, '')
}
function ensureLeadingSlash(s: string) {
  return s.startsWith('/') ? s : `/${s}`
}

export default defineEventHandler(async (event): Promise<ApiResp<SystemInfo>> => {
  const config = useRuntimeConfig()

  if (config.public.apiMode === 'mock') {

    const now = new Date().toISOString()
    return {
      data: {
        version: pickEnv('NUXT_PUBLIC_APP_VERSION', 'APP_VERSION', 'VERSION') || '0.0.0-dev',
        commit: pickEnv('NUXT_PUBLIC_GIT_COMMIT', 'GIT_COMMIT', 'COMMIT_SHA') || 'mock',
        buildTime: pickEnv('NUXT_PUBLIC_BUILD_TIME', 'BUILD_TIME') || now,
        serverTime: now,
        uptimeSec: Math.floor(process.uptime()),
        mode: 'mock',
      },
    }

  }


  // real: call backend upstream (NO Authorization/Cookie passthrough)
  const upstream = trimSlashRight(String(config.upstream || ''))
  if (!upstream) {
    throw createError({ statusCode: 500, statusMessage: 'runtimeConfig.upstream is empty' })
  }

  // reuse runtimeConfig.baseURL, e.g. '/api'
  const backendBase = ensureLeadingSlash(String(config.baseURL || '/api'))
  const targetUrl = `${upstream}${backendBase}/system/version`

  try {
    const resp = await $fetch<any>(targetUrl, { method: 'GET' })

    // backend may return { data: SystemInfo } or SystemInfo
    const data: SystemInfo = resp?.data ? resp.data : resp

    return { data: { ...data, mode: 'real' } }
  } catch (e: any) {
    const statusCode = e?.statusCode || e?.status || 502
    setResponseStatus(event, statusCode)
    throw createError({
      statusCode,
      statusMessage: e?.data?.message || e?.message || 'Upstream request failed',
    })
  }
})