import { getAuthSession } from 'nuxt-auth-utils'

export default defineEventHandler((event) => {
  const { authMock } = useRuntimeConfig().public

  if (authMock) {
    return {
      user: {
        id: 1,
        name: 'Mock User',
        role: 'admin',
      },
    }
  }

  const session = getAuthSession(event)
  return session ?? null
})