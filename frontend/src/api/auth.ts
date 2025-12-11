// src/api/auth.ts
import axios from 'axios'
import type { UserInfo } from '@/store/auth'

const mockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

/**
 * 登录接口
 * 后端建议返回结构：
 * {
 *   "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
 *   "user": { "id": "84a35e05-531f-4d96-8d5b-bc8a7a358493", "username": "root" },
 * }
 */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  if (mockEnabled) {
    // mock 模式：本地假数据
    return Promise.resolve({
      token: 'mock-token-' + Date.now(),
      user: {
        id: '84a35e05-531f-4d96-8d5b-bc8a7a358493',
        username: payload.username || 'root',
      },
    })
  }

  const { data } = await axios.post<LoginResponse>('/v1/api/auth', payload)
  return data
}

/**
 * 登出接口（可选）
 * 如果后端有登出逻辑可以实现；没有的话前端直接清 auth 即可。
 */
export async function logoutApi(): Promise<void> {
  if (mockEnabled) {
    return Promise.resolve()
  }
  await axios.post('/api/auth/logout')
}