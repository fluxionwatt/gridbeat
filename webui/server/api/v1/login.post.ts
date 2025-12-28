import { setAuthSession } from 'nuxt-auth-utils'

export default defineEventHandler(async (event) => {
  const { authMock } = useRuntimeConfig().public
  const body = await readBody(event)

  if (authMock) {
    return { ok: true }
  }

  // 👉 示例：真实校验（替换成 DB / API）
  if (body.username !== 'admin' || body.password !== '123456') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  await setAuthSession(event, {
    user: {
      id: 1,
      name: 'Admin',
      role: 'admin',
    },
  })

  return { ok: true }
})