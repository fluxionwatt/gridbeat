// app/plugins/api.ts
export default defineNuxtPlugin(() => {
  const token = useCookie<string | null>('token')

  const api = $fetch.create({
    baseURL: '/api/v1',
    onRequest({ options }) {
      if (token.value) {
        options.headers = { ...(options.headers as any), Authorization: `Bearer ${token.value}` }
      }
    },
  })

  return { provide: { api } }
})

declare module '#app' {
  interface NuxtApp {
    $api: typeof $fetch
  }
}
