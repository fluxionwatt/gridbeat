/**
 * GET /api/me
 * For @sidebase/nuxt-auth (local provider) signOut endpoint.
 */
import { defineEventHandler, getRequestHeader } from 'h3'

type MeResponse = {
  user: { id: number | string; name: string; roles: string[] }
}

export default defineEventHandler(async (event): Promise<MeResponse> => {
  const config = useRuntimeConfig()

  if (config.public.apiMode === 'mock') {
    return { user: { id: 1, name: 'Mock Admin', roles: ['admin'] } }
  }

  const auth = getRequestHeader(event, 'authorization')

  return await $fetch<MeResponse>('/api/me', {
    baseURL: config.upstream,
    headers: auth ? { authorization: auth } : undefined,
  })
})