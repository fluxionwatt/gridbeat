import { defineEventHandler } from 'h3'

/**
 * GET /api/v1/me
 * For @sidebase/nuxt-auth (local provider) signOut endpoint.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (config.public.apiMode === 'mock') {
    return { user: { id: 1, name: 'Mock Admin', roles: ['admin'] } }
  }

  const auth = getRequestHeader(event, 'authorization')
  return await $fetch('/api/v1/me', {
    baseURL: config.upstream,
    headers: auth ? { authorization: auth } : undefined,
  })
})