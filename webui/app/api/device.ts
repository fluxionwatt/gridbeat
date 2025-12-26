// src/api/device.ts
import http from './http'
import { USE_MOCK } from './config'

export type DeviceStatus = 'online' | 'offline' | 'alarm' | 'unknown'

export interface DeviceItem {
  id: number
  name: string
  sn: string
  ip: string
  group: string
  groupName: string
  status: DeviceStatus
  lastSeen: string
  firmware: string
}

export interface DeviceListQuery {
  keyword?: string
  status?: string
  group?: string
  page: number
  pageSize: number
}

export interface DeviceListResp {
  items: DeviceItem[]
  total: number
}

export interface DeviceDetail extends DeviceItem {
  createdAt: string
  remark?: string
}

export async function getDeviceListApi(
  query: DeviceListQuery,
): Promise<DeviceListResp> {
  if (USE_MOCK) {
    const all: DeviceItem[] = [
      {
        id: 1,
        name: 'GW-01 主变电站网关',
        sn: 'GW202511210001',
        ip: '10.0.0.11',
        group: 'substation',
        groupName: '主变电站',
        status: 'online',
        lastSeen: '2025-11-21 10:30:21',
        firmware: 'v1.2.3',
      },
      {
        id: 2,
        name: 'GW-02 厂区 A 栋屋顶',
        sn: 'GW202511210002',
        ip: '10.0.0.12',
        group: 'roof',
        groupName: '厂区屋顶',
        status: 'alarm',
        lastSeen: '2025-11-21 10:29:58',
        firmware: 'v1.2.1',
      },
      {
        id: 3,
        name: 'GW-03 储能区网关',
        sn: 'GW202511210003',
        ip: '10.0.0.13',
        group: 'ess',
        groupName: '储能区',
        status: 'offline',
        lastSeen: '2025-11-21 10:10:03',
        firmware: 'v1.1.9',
      },
    ]

    // 简单本地过滤，同你 List.vue 里的逻辑
    let list = [...all]
    if (query.keyword?.trim()) {
      const kw = query.keyword.trim().toLowerCase()
      list = list.filter(
        d =>
          d.name.toLowerCase().includes(kw) ||
          d.sn.toLowerCase().includes(kw) ||
          d.ip.toLowerCase().includes(kw),
      )
    }
    if (query.status) list = list.filter(d => d.status === query.status)
    if (query.group) list = list.filter(d => d.group === query.group)

    const total = list.length
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    const items = list.slice(start, end)

    return Promise.resolve({ items, total })
  }

  return http.get('/devices', { params: query })
}

export async function getDeviceDetailApi(
  id: number | string,
): Promise<DeviceDetail> {
  if (USE_MOCK) {
    return Promise.resolve({
      id: Number(id),
      name: 'GW-01 主变电站网关',
      sn: 'GW202511210001',
      ip: '10.0.0.11',
      group: 'substation',
      groupName: '主变电站',
      status: 'online',
      lastSeen: '2025-11-21 10:30:21',
      firmware: 'v1.2.3',
      createdAt: '2025-08-01 14:23:00',
      remark: '示例设备，可接入真实 BESS / 光伏网关数据',
    })
  }

  return http.get(`/devices/${id}`)
}
