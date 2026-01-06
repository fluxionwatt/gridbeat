export function useApi() {
  const { token } = useAuth()

  return $fetch.create({
    baseURL: '/api',
    headers: token.value ? { Authorization: `${token.value}` } : undefined,
  })
}