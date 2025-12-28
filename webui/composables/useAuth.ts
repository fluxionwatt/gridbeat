export const useAuth = () => {
  const user = useState<any | null>('auth:user', () => null)
  const pending = useState(false)

  const fetchUser = async () => {
    pending.value = true
    try {
      const res: any = await $fetch('/api/auth/me', {
        credentials: 'include',
      })
      user.value = res?.user ?? null
    } catch {
      user.value = null
    } finally {
      pending.value = false
    }
  }

  const login = async (payload: { username: string; password: string }) => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: payload,
      credentials: 'include',
    })
    await fetchUser()
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    user.value = null
    await navigateTo('/login')
  }

  return {
    user,
    pending,
    isLoggedIn: computed(() => !!user.value),
    fetchUser,
    login,
    logout,
  }
}