// app/stores/auth.ts
import { defineStore } from 'pinia'

type User = { id: string; username: string; role: 'admin' | 'viewer' }

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('gw_token')
  const user = useState<User | null>('gw_user', () => null)

  const isAuthed = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const { $api } = useNuxtApp()
    const res = await $api<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    token.value = res.token
    user.value = res.user
  }

  function logout() {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return { token, user, isAuthed, login, logout }
})