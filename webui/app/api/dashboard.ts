// src/api/dashboard.ts
import http from './http'
import { USE_MOCK } from './config'

export interface DashboardOverview {
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  activeAlarms: number
  todayEnergy: number
}

export interface AlarmItem {
  id: number
  level: 'critical' | 'major' | 'minor'
  deviceName: string
  message: string
  time: string
}

export interface TrendPoint {
  time: string
  power: number
}

export interface DashboardResp {
  overview: DashboardOverview
  alarms: AlarmItem[]
  trend: TrendPoint[]
}

export interface DashboardQuery {
  start?: string
  end?: string
}

export async function getDashboardApi(
  _query: DashboardQuery,
): Promise<DashboardResp> {
  if (USE_MOCK) {
    // mock overview
    const overview: DashboardOverview = {
      totalDevices: 128,
      onlineDevices: 120,
      offlineDevices: 8,
      activeAlarms: 3,
      todayEnergy: 5230.4,
    }

    // mock alarms
    const alarms: AlarmItem[] = [
      {
        id: 1,
        level: 'critical',
        deviceName: 'GW-01（主变电站）',
        message: 'PCS 逆变单元过温',
        time: '2025-11-21 10:21:01',
      },
      {
        id: 2,
        level: 'major',
        deviceName: 'GW-02（厂区 A 栋屋顶）',
        message: '通讯中断超过 5 分钟',
        time: '2025-11-21 10:18:23',
      },
    ]

    // mock trend
    const trend: TrendPoint[] = []
    const now = new Date()
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 5 * 60 * 1000)
      const hh = t.getHours().toString().padStart(2, '0')
      const mm = t.getMinutes().toString().padStart(2, '0')
      const base = 120
      const noise = Math.sin(i / 3) * 20 + (Math.random() - 0.5) * 10
      trend.push({
        time: `${hh}:${mm}`,
        power: parseFloat((base + noise).toFixed(1)),
      })
    }

    return Promise.resolve({ overview, alarms, trend })
  }

  // 真后台
  return http.get('/dashboard', { params: _query })
}
