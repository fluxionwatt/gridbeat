// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // 允许 page meta 标记公开页
  const isPublic = (to.meta as any).public === true
  if (isPublic) return

  const token = useCookie<string | null>('gw_token')
  if (!token.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})