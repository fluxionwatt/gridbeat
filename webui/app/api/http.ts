// src/api/http.ts
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL

const http = axios.create({
  baseURL,
  timeout: 10000,
})

// 请求拦截器：带上 token
http.interceptors.request.use(
  config => {
    const auth = useAuthStore()
    if (auth.token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
  },
  error => Promise.reject(error),
)

// 响应拦截器：统一处理 data / 错误
http.interceptors.response.use(
  response => {
    // 后端如果是 { code, data, msg } 这种，这里可以统一拆一下
    return response.data
  },
  error => {
    // 这里可以接 element-plus 的 ElMessage / 401 跳登录 等
    console.error('API error:', error)
    return Promise.reject(error)
  },
)

export default http
