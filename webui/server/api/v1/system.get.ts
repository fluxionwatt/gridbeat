// server/api/v1/system.get.ts
import { defineEventHandler, getRequestHeader, setResponseStatus, createError } from 'h3'

type SystemInfo = {
  version: string
  commit: string
  buildTime: string
  serverTime: string
  uptimeSec: number
}

function envFirst(...keys: string[]) {
  for (const k of keys) {
    const v = process.env[k]
    if (v && v.trim()) return v.trim()
  }
  return ''
}

export default defineEventHandler(async (event): Promise<SystemInfo> => {
  const config = useRuntimeConfig()

  // 你的 nuxt.config.ts 里：
  // runtimeConfig.public.apiMode: 'mock' | 'real' ...
  const apiMode = (config.public?.apiMode || 'mock').toString().toLowerCase()
  const forceMock = (getRequestHeader(event, 'x-mock') || '').toString() === '1'
  const isMock = forceMock || apiMode === 'mock'

  if (isMock) {
    const now = new Date()

    // 这些可以在 CI/CD 注入，也可以不注入（会有 fallback）
    const version = envFirst('NUXT_PUBLIC_APP_VERSION', 'APP_VERSION', 'VERSION') || '0.0.0-dev'
    const commit = envFirst('NUXT_PUBLIC_GIT_COMMIT', 'GIT_COMMIT', 'COMMIT_SHA') || 'mock'
    const buildTime =
      envFirst('NUXT_PUBLIC_BUILD_TIME', 'BUILD_TIME') || now.toISOString()

    return {
      version,
      commit,
      buildTime,
      serverTime: now.toISOString(),
      uptimeSec: Math.floor(process.uptime()),
    }
  }

  // ============ real mode: proxy to upstream ============
  const upstream = (config.upstream || '').toString().replace(/\/+$/, '')
  if (!upstream) {
    throw createError({
      statusCode: 500,
      statusMessage: 'runtimeConfig.upstream is empty',
    })
  }

  // 约定后端同路径：GET {upstream}/api/v1/system
  const url = `${upstream}/api/v1/system`

  // 透传鉴权：Authorization / Cookie（按你后端实际方案）
  const authorization = getRequestHeader(event, 'authorization')
  const cookie = getRequestHeader(event, 'cookie')

  try {
    const data = await $fetch<SystemInfo>(url, {
      method: 'GET',
      headers: {
        ...(authorization ? { authorization } : {}),
        ...(cookie ? { cookie } : {}),
      },
    })

    // 兜底：确保字段存在
    const now = new Date().toISOString()
    return {
      version: data?.version ?? 'unknown',
      commit: data?.commit ?? 'unknown',
      buildTime: data?.buildTime ?? 'unknown',
      serverTime: data?.serverTime ?? now,
      uptimeSec: Number.isFinite((data as any)?.uptimeSec) ? (data as any).uptimeSec : 0,
    }
  } catch (e: any) {
    const statusCode = e?.statusCode || e?.status || 502
    setResponseStatus(event, statusCode)

    throw createError({
      statusCode,
      statusMessage: e?.data?.message || e?.message || 'Upstream request failed',
    })
  }
})