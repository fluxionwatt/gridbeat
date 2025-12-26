export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)

  if (body.username !== 'admin' || body.password !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  return {
    token: 'mock-token-abc-123',
    user: { id: 'u-1', username: 'admin', role: 'admin' as const },
  }
})