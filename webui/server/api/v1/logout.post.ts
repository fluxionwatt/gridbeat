import { clearAuthSession } from 'nuxt-auth-utils'

export default defineEventHandler(async (event) => {
  const { authMock } = useRuntimeConfig().public

  if (!authMock) {
    await clearAuthSession(event)
  }

  return { ok: true }
})