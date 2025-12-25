export default defineEventHandler((event) => {
  const auth = getHeader(event, 'authorization') || ''
  if (!auth.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return { id: 'u-1', username: 'admin', role: 'admin' }
})