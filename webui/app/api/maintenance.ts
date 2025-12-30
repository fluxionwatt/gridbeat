// src/api/maintenance.ts
import http from './http'

const mockEnabled = import.meta.env.VITE_USE_MOCK === 'true'

export interface ServiceStatus {
  name: string
  status: 'up' | 'down' | 'degraded'
}

export interface MaintenanceOverviewResponse {
  uptimeSeconds: number
  cpuUsage: number // 0 - 100
  memUsage: number // 0 - 100
  services: ServiceStatus[]
}

/**
 * 获取维护概览数据
 * GET /api/maintenance/overview
 */
export async function getMaintenanceOverviewApi(): Promise<MaintenanceOverviewResponse> {
  if (mockEnabled) {
    // ⭐ mock 数据
    const now = Date.now()
    const base = (now / 1000) % 3600

    return Promise.resolve({
      uptimeSeconds: 3 * 24 * 3600 + Math.floor(base), // 大约 3 天
      cpuUsage: 20 + Math.random() * 30, // 20~50%
      memUsage: 40 + Math.random() * 30, // 40~70%
      services: [
        { name: 'Modbus', status: 'up' },
        { name: 'MQTT', status: 'down' },
        { name: 'Northbound', status: 'degraded' },
      ],
    })
  }

  return http.get('/maintenance/overview', {})
}