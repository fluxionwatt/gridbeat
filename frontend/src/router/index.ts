// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
//import { ElMessage } from 'element-plus'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/store/auth'
import { i18n } from '@/plugins/i18n'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { public: true, layout: 'auth', titleKey: 'route.login', },
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { titleKey: 'route.overview', requiresAuth: true },
      },
      {
        path: 'devices',
        name: 'DeviceList',
        component: () => import('@/views/device/List.vue'),
        meta: { title: 'device.list', requiresAuth: true, roles: ['admin', 'operator'] },
      },
      {
        path: 'devices/:id',
        name: 'DeviceDetail',
        component: () => import('@/views/device/Detail.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'operator'] },
      },

      // 历史查询
      {
        path: 'history',
        redirect: '/history/alarm',
      },
{
  path: 'history/alarm',
  name: 'HistoryAlarm',
  component: () => import('@/views/history/Alarm.vue'),
  meta: {
    titleKey: 'route.historyAlarm', // 历史告警
  },
},
{
  path: 'history/operation-log',
  name: 'HistoryOperationLog',
  component: () => import('@/views/history/OperationLog.vue'),
  meta: {
    titleKey: 'route.historyOperationLog', // 操作日志
  },
},
{
  path: 'history/security-event',
  name: 'HistorySecurityEvent',
  component: () => import('@/views/history/SecurityEvent.vue'),
  meta: {
    titleKey: 'route.historySecurityEvent', // 安全事件
  },
},
{
  path: 'history/security-log',
  name: 'HistorySecurityLog',
  component: () => import('@/views/history/SecurityLog.vue'),
  meta: {
    titleKey: 'route.historySecurityLog', // 安全日志
  },
},
{
  path: 'history/export',
  name: 'HistoryDataExport',
  component: () => import('@/views/history/DataExport.vue'),
  meta: {
    titleKey: 'route.historyDataExport', // 数据导出
  },
},


 {
    path: '/configuration/south-driver',
    name: 'SouthDevice',
    meta: { title: 'config.southDeviceManagement' },
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'SouthDriver',
        component: () => import('@/views/settings/ports/southDriver/Index.vue'),
        meta: { hiddenBreadcrumb: true },
      },
      {
        path: 'config/:node',
        name: 'SouthDriverConfig',
        component: () => import('@/views/settings/ports/southDriver/NodeConfig.vue'),
        props: {
          
        },
        meta: { title: 'config.deviceConfig' },
      },
      {
        path: ':node/:plugin',
        name: 'SouthDriverGroupG',
        component: () => import('@/views/settings/ports/southDriver/LayoutContent.vue'),
        meta: { title: 'config.groupList' },
        children: [
          {
            path: '',
            name: 'SouthDriverGroup',
            component: () => import('@/views/settings/ports/southDriver/Group.vue'),
          },
          {
            path: ':group',
            name: 'SouthGroupTags',
            meta: { title: 'config.tagList' },
            component: () => import('@/views/settings/ports/southDriver/LayoutContent.vue'),
            children: [
              {
                path: '',
                name: 'SouthDriverGroupTag',
                component: () => import('@/views/settings/ports/southDriver/Tag.vue'),
              },
              {
                path: 'add',
                name: 'SouthDriverGroupAddTag',
                component: () => import('@/views/settings/ports/southDriver/AddTag.vue'),
                meta: { title: 'config.addTags' },
              },
            ],
          },
        ],
      },
    ],
  },

      // 设置
      {
        path: 'settings',
        redirect: '/settings/basic',
      },
      {
        path: 'settings/basic',
        name: 'SettingsBasic',
        component: () => import('@/views/settings/Basic.vue'),
        meta: { requiresAuth: true, titleKey: 'route.settingsBasic', roles: ['admin', 'operator'] },
      },
{
  path: 'settings/datetime',
  name: 'SettingsDateTime',
  component: () => import('@/views/settings/DateTime.vue'),
  meta: {
    titleKey: 'route.settingsDateTime', // 日期与时间
  },
},
{
  path: 'settings/ports',
  redirect: '/settings/ports/southDriver',
},
{
  path: 'settings/ports/southDriver',
  name: 'SettingsPortsouthDriver',
  component: () => import('@/views/settings/ports/southDriver/Index.vue'),
  meta: {
    titleKey: 'route.settingssouthDriver', // 端口设置 - 南向
  },
},
{
  path: 'settings/ports/wan',
  name: 'SettingsPortWan',
  component: () => import('@/views/settings/ports/Wan.vue'),
  meta: {
    titleKey: 'route.settingsPortWan', // 端口设置 - WAN
  },
},
{
  path: 'settings/ports/ethernet',
  name: 'SettingsPortEthernet',
  component: () => import('@/views/settings/ports/Ethernet.vue'),
  meta: {
    titleKey: 'route.settingsPortEthernet', // 端口设置 - 以太网
  },
},
{
  path: 'settings/ports/rs485',
  name: 'SettingsPortRS485',
  component: () => import('@/views/settings/ports/RS485.vue'),
  meta: {
    titleKey: 'route.settingsPortRS485', // 端口设置 - RS485
  },
},
{
  path: 'settings/ports/mbus',
  name: 'SettingsPortMBUS',
  component: () => import('@/views/settings/ports/MBUS.vue'),
  meta: {
    titleKey: 'route.settingsPortMBUS', // 端口设置 - MBUS
  },
},
{
  path: 'settings/ports/aidi',
  name: 'SettingsPortAIDI',
  component: () => import('@/views/settings/ports/AIDI.vue'),
  meta: {
    titleKey: 'route.settingsPortAIDI', // 端口设置 - AI/DI
  },
},
{
  path: 'settings/ports/ct',
  name: 'SettingsPortCT',
  component: () => import('@/views/settings/ports/CT.vue'),
  meta: {
    titleKey: 'route.settingsPortCT', // 端口设置 - CT
  },
},
{
  path: 'settings/protocols',
  redirect: '/settings/protocols/modbus',
},
{
  path: 'settings/protocols/modbus',
  name: 'SettingsProtocolModbus',
  component: () => import('@/views/settings/protocols/Modbus.vue'),
  meta: {
    titleKey: 'route.settingsProtocolModbus', // 通信协议 - Modbus
  },
},
{
  path: 'settings/protocols/iec104',
  name: 'SettingsProtocolIEC104',
  component: () => import('@/views/settings/protocols/IEC104.vue'),
  meta: {
    titleKey: 'route.settingsProtocolIEC104', // 通信协议 - IEC104
  },
},
{
  path: 'settings/protocols/goose',
  name: 'SettingsProtocolGOOSE',
  component: () => import('@/views/settings/protocols/GOOSE.vue'),
  meta: {
    titleKey: 'route.settingsProtocolGOOSE', // 通信协议 - GOOSE
  },
},
{
  path: 'settings/protocols/https',
  name: 'SettingsProtocolHTTPS',
  component: () => import('@/views/settings/protocols/HTTPS.vue'),
  meta: {
    titleKey: 'route.settingsProtocolHTTPS', // 通信协议 - HTTPS
  },
},
{
  path: 'settings/gridcontrol',
  redirect: '/settings/gridcontrol/activepower',
},
{
  path: 'settings/gridcontrol/activepower',
  name: 'SettingsActivePower',
  component: () => import('@/views/settings/gridcontrol/ActivePower.vue'),
  meta: {
    titleKey: 'route.settingsActivePower', // activepower
  },
},
{
  path: 'settings/gridcontrol/reactivepower',
  name: 'SettingsReactivePower',
  component: () => import('@/views/settings/gridcontrol/ReactivePower.vue'),
  meta: {
    titleKey: 'route.settingsReactivePower', // ReactivePower
  },
},
{
  path: 'settings/gridcontrol/connectiondata',
  name: 'SettingsConnectionData',
  component: () => import('@/views/settings/gridcontrol/ConnectionData.vue'),
  meta: {
    titleKey: 'route.settingsConnectionData', // ConnectionData
  },
},
{
  path: 'settings/stemNodesetup',
  name: 'SettingsStemNodeSetup',
  component: () => import('@/views/settings/StemNodeSetup.vue'),
  meta: {
    titleKey: 'route.StemNodeSetupTitle', // StemNodeSetupTitle
  },
},
{
  path: 'settings/license',
  name: 'SettingsLicense',
  component: () => import('@/views/settings/License.vue'),
  meta: {
    titleKey: 'route.LicenseTitle', // License
  },
},
      // 维护
      {
        path: 'maintenance',
        redirect: '/maintenance/overview',
      },
      {
        path: 'maintenance/overview',
        name: 'MaintenanceIndex',
        component: () => import('@/views/maintenance/Index.vue'),
        meta: { requiresAuth: true, titleKey: 'route.maintenance', roles: ['admin', 'operator'] },
      },
      {
        path: 'maintenance/terminal',
        name: 'MaintenanceDeviceTerminal',
        component: () => import('@/views/maintenance/DeviceTerminal.vue'),
        meta: { requiresAuth: true, titleKey: 'route.maintenanceTerminal' },
      }, 
      // 向导
      {
        path: 'wizard/gateway',
        name: 'GatewayWizard',
        component: () => import('@/views/wizard/GatewayWizard.vue'),
        meta: { requiresAuth: true, titleKey: 'route.gatewayWizard', roles: ['admin', 'operator'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * 懒加载恢复登录状态：第一次进入守卫时从 localStorage 取
 */
let authInitialized = false

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (!authInitialized) {
    auth.initFromStorage()
    authInitialized = true
  }

  const requiresAuth = to.meta.requiresAuth !== false // 默认需要登录
  const isLoginRoute = to.path === '/login'

  // 1）未登录访问需要鉴权页面 → 跳到 /login
  if (requiresAuth && !auth.isAuthenticated && !isLoginRoute) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  // ⚠ 2）不再禁止已登录访问 /login
  //    也就是说，即使已经登录，手动访问 /login 也能看到登录页
  //    如果你以后想恢复“登录后访问 /login 自动跳首页”，再加回来即可：
  // if (isLoginRoute && auth.isAuthenticated) {
  //   return next('/')
  // }

  // 3）会话超时联动：已登录且不是 login，每次路由跳转视为一次活跃
  if (auth.isAuthenticated && !isLoginRoute) {
    auth.touch()
  }

  next()
})


/**
 * ⭐ 统一设置页面标题 + i18n
 * 规则：
 *  - 优先使用 meta.titleKey → t(titleKey)
 *  - 否则使用 meta.title（如果你将来某个页面想写死标题也行）
 *  - 都没有则用基础标题
 */
const BASE_TITLE_KEY = 'app.title' // 比如“工业网关后台”
const { t } = i18n.global

router.afterEach((to) => {
  const titleKey = to.meta?.titleKey as string | undefined
  const rawTitle = to.meta?.title as string | undefined

  let pageTitle = ''

  if (titleKey) {
    pageTitle = t(titleKey)
  } else if (rawTitle) {
    pageTitle = rawTitle
  } else {
    pageTitle = t(BASE_TITLE_KEY)
  }

  // 最终 document.title：<当前页面> - <基础标题>
  const base = t(BASE_TITLE_KEY)
  if (pageTitle && pageTitle !== base) {
    document.title = `${pageTitle} - ${base}`
  } else {
    document.title = base
  }
})


export default router