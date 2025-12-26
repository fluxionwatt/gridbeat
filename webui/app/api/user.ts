// src/api/user.ts
import http from './http'
import { USE_MOCK } from './config'

export interface UserItem {
  id: number
  username: string
  nickname: string
  email: string
  roles: string[]
  enabled: boolean
  lastLogin: string
}

export interface UserListQuery {
  keyword?: string
  role?: string
  status?: '' | boolean
  page: number
  pageSize: number
}

export interface UserListResp {
  items: UserItem[]
  total: number
}

export interface SaveUserReq {
  id?: number
  username: string
  nickname: string
  email: string
  roles: string[]
  enabled: boolean
  password?: string
}

export async function getUserListApi(
  query: UserListQuery,
): Promise<UserListResp> {
  if (USE_MOCK) {
    const all: UserItem[] = [
      {
        id: 1,
        username: 'admin',
        nickname: '系统管理员',
        email: 'admin@example.com',
        roles: ['admin'],
        enabled: true,
        lastLogin: '2025-11-21 09:56:12',
      },
      {
        id: 2,
        username: 'ops01',
        nickname: '运维小张',
        email: 'ops01@example.com',
        roles: ['operator'],
        enabled: true,
        lastLogin: '2025-11-21 08:13:45',
      },
    ]

    let list = [...all]
    if (query.keyword?.trim()) {
      const kw = query.keyword.trim().toLowerCase()
      list = list.filter(
        u =>
          u.username.toLowerCase().includes(kw) ||
          u.nickname.toLowerCase().includes(kw) ||
          u.email.toLowerCase().includes(kw),
      )
    }
    if (query.status !== '') {
      list = list.filter(u => u.enabled === query.status)
    }

    const total = list.length
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    const items = list.slice(start, end)

    return Promise.resolve({ items, total })
  }

  return http.get('/users', { params: query })
}

export async function saveUserApi(data: SaveUserReq): Promise<void> {
  if (USE_MOCK) {
    // 前端 mock，这里不需要真正存
    return Promise.resolve()
  }

  if (data.id) {
    await http.put(`/users/${data.id}`, data)
  } else {
    await http.post('/users', data)
  }
}

export async function deleteUserApi(id: number): Promise<void> {
  if (USE_MOCK) return Promise.resolve()
  await http.delete(`/users/${id}`)
}