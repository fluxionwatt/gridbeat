<template>
  <div class="default-layout d-flex flex-column vh-100">
    <!-- 顶部导航：始终全宽 -->
    <BNavbar toggleable="lg" class="border-bottom bg-light px-3 w-100">
      <!-- 左上角：只保留图标 -->
      <BNavbarBrand class="d-flex align-items-center">
        <font-awesome-icon icon="fa-solid fa-gauge" class="me-2" />
      </BNavbarBrand>

      <!-- 顶部一级菜单（Bootstrap 风格） -->
      <BNavbarNav class="ms-3 me-auto d-flex align-items-center">
        <BNavItem
          v-for="m in topMenus"
          :key="m.key"
          href="#"
          :active="activeTopMenu === m.key"
          class="text-nowrap"
          @click.prevent="onTopMenuClick(m)"
        >
          {{ m.label }}
        </BNavItem>
      </BNavbarNav>

      <!-- 右侧工具区：语言 / 版本 / 退出 -->
      <BNavbarNav class="d-flex align-items-center">
        <!-- 语言切换 -->
        <el-dropdown>
          <span class="el-dropdown-link d-flex align-items-center">
            <font-awesome-icon
              icon="fa-solid fa-globe"
              class="me-1 top-icon"
            />
            {{ currentLocaleLabel }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeLang('zh-CN')">
                简体中文
              </el-dropdown-item>
              <el-dropdown-item @click="changeLang('en')">
                English
              </el-dropdown-item>
              <el-dropdown-item @click="changeLang('ja')">
                日本語
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 版本信息按钮 -->
        <el-button
          text
          class="ms-3 d-flex align-items-center"
          @click="openVersionDialog"
        >
          <font-awesome-icon
            icon="fa-solid fa-circle-info"
            class="me-1 top-icon"
          />
          {{ $t('common.about') || '版本' }}
        </el-button>

        <!-- 退出按钮 -->
        <el-button
          text
          class="ms-3 d-flex align-items-center"
          @click="logout"
        >
          <font-awesome-icon
            icon="fa-solid fa-sign-out-alt"
            class="me-1 top-icon"
          />
          {{ $t('common.logout') || '退出登录' }}
        </el-button>
      </BNavbarNav>
    </BNavbar>

    <!-- 主体区域：左侧菜单 + 右侧内容 -->
    <div class="flex-grow-1 d-flex main-wrapper">
      <!-- 左侧二级菜单：只在非“向导”时渲染，不占位时就彻底没有 -->
      <div
        v-if="activeTopMenu !== 'wizard'"
        class="border-end sidebar-wrapper"
      >
        <!-- 概览：Dashboard + 设备列表 -->
        <el-menu
          v-if="activeTopMenu === 'overview'"
          :default-active="activeSideMenu"
          class="border-0"
          router
        >
          <el-menu-item index="/">
            <font-awesome-icon icon="fa-solid fa-gauge" class="me-2" />
            <span>总览</span>
          </el-menu-item>
          <el-menu-item index="/devices">
            <font-awesome-icon icon="fa-solid fa-server" class="me-2" />
            <span>设备列表</span>
          </el-menu-item>
        </el-menu>

        <!-- 设备监控 -->
        <el-menu
          v-else-if="activeTopMenu === 'monitor'"
          :default-active="activeSideMenu"
          class="border-0"
          router
        >
          <el-menu-item index="/devices">
            <font-awesome-icon icon="fa-solid fa-server" class="me-2" />
            <span>设备列表</span>
          </el-menu-item>
          <el-menu-item index="/devices">
            <span>实时监控（预留）</span>
          </el-menu-item>
          <el-menu-item index="/devices">
            <span>告警总览（预留）</span>
          </el-menu-item>
        </el-menu>

        <!-- 历史查询 -->
        <el-menu
          v-else-if="activeTopMenu === 'history'"
          :default-active="activeSideMenu"
          class="border-0"
          router
        >
          <el-menu-item index="/history/alarm">
            <span>{{ t('history.alarmTitle') }}</span>
          </el-menu-item>
          <el-menu-item index="/history/operation-log">
            <span>{{ t('history.operationTitle') }}</span>
          </el-menu-item>
          <el-menu-item index="/history/security-event">
            <span>{{ t('history.securityEventTitle') }}</span>
          </el-menu-item>
          <el-menu-item index="/history/security-log">
            <span>{{ t('history.securityLogTitle') }}</span>
          </el-menu-item>
          <el-menu-item index="/history/export">
            <span>{{ t('history.exportTitle') }}</span>
          </el-menu-item>
        </el-menu>

        <!-- 设置 -->
        <el-menu
          v-else-if="activeTopMenu === 'settings'"
          :default-active="activeSideMenu"
          class="border-0"
          router
        >
          <el-menu-item index="/settings/basic">
            <span>{{ t('route.settingsBasic') }}</span>
          </el-menu-item>
          <el-menu-item index="/settings/datetime">
            <span>{{ t('route.settingsDateTime') }}</span>
          </el-menu-item>

          <el-sub-menu index="/settings/ports">
          <template #title><span>{{ t('route.settingsPort') }}</span></template>
          <el-menu-item index="/settings/ports/southDriver">{{ t('settings.southDriverTitle') }}</el-menu-item>
          <el-menu-item index="/settings/ports/wan">{{ t('settings.portWanTitle') }}</el-menu-item>
          <el-menu-item index="/settings/ports/ethernet">{{ t('settings.portEthernetTitle') }}</el-menu-item>
          <el-menu-item index="/settings/ports/rs485">{{ t('settings.portRS485Title') }}</el-menu-item>
          <el-menu-item index="/settings/ports/mbus">{{ t('settings.portMBUSTitle') }}</el-menu-item>
          <el-menu-item index="/settings/ports/aidi">{{ t('settings.portAIDITitle') }}</el-menu-item>
          <el-menu-item index="/settings/ports/ct">{{ t('settings.portCTTitle') }}</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/settings/protocols">
          <template #title><span>{{ t('route.settingsProtocol') }}</span></template>
          <el-menu-item index="/settings/protocols/modbus">{{ t('settings.protocolModbusTitle') }}</el-menu-item>
          <el-menu-item index="/settings/protocols/iec104">{{ t('settings.protocolIEC104Title') }}</el-menu-item>
          <el-menu-item index="/settings/protocols/goose">{{ t('settings.protocolGOOSETitle') }}</el-menu-item>
          <el-menu-item index="/settings/protocols/https">{{ t('settings.protocolHTTPSTitle') }}</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/settings/gridcontrol">
          <template #title><span>{{ t('settings.GridControlTitle') }}</span></template>
          <el-menu-item index="/settings/gridcontrol/activepower">{{ t('settings.GridControlActivePowerTitle') }}</el-menu-item>
          <el-menu-item index="/settings/gridcontrol/reactivepower">{{ t('settings.GridControlReactivePowerTitle') }}</el-menu-item>
          <el-menu-item index="/settings/gridcontrol/connectiondata">{{ t('settings.GridControlConnectionDataTitle') }}</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/settings/stemNodesetup">
            <span>{{ t('settings.StemNodeSetupTitle') }}</span>
          </el-menu-item>
          <el-menu-item index="/settings/license">
            <span>{{ t('settings.LicenseTitle') }}</span>
          </el-menu-item>
        </el-menu>

        <!-- 维护 -->
        <el-menu
          v-else-if="activeTopMenu === 'maintenance'"
          :default-active="activeSideMenu"
          class="border-0"
          router
        >
          <el-menu-item index="/maintenance/overview">
            <span>{{ t('route.maintenance') }}</span>
          </el-menu-item>
          <el-menu-item index="/maintenance/terminal">
            <span>{{ t('maintenance.deviceTerminal') }}</span>
          </el-menu-item>
        </el-menu>

        <!-- 兜底 -->
        <el-menu
          v-else
          :default-active="activeSideMenu"
          class="border-0"
          router
        >
          <el-menu-item index="/">
            <span>总览</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容区域：所有一级菜单共用同一个样式 -->
      <div class="flex-grow-1 d-flex flex-column content-main">
        <router-view />

        <div class="app-footer text-center text-muted small mt-4">
          Industrial Gateway Console · v{{ appVersion }}
        </div>
      </div>
    </div>

    <!-- 版本信息弹窗 -->
    <el-dialog
      v-model="versionDialogVisible"
      title="版本信息"
      width="480px"
    >
      <el-skeleton v-if="versionLoading" :rows="4" animated />

      <template v-else>
        <div v-if="versionInfo">
          <h5 class="mb-2">
            {{ versionInfo.productName || 'Industrial Gateway Console' }}
          </h5>

          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="版本">
              {{ versionInfo.Version }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="versionInfo.buildTime"
              label="构建时间"
            >
              {{ versionInfo.buildTime }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="versionInfo.gitCommit"
              label="Git 提交"
            >
              {{ versionInfo.gitCommit }}
            </el-descriptions-item>
          </el-descriptions>

          <div
            v-if="versionInfo.copyright"
            class="text-muted small mt-3"
          >
            {{ versionInfo.copyright }}
          </div>
          <div
            v-if="versionInfo.extra"
            class="text-muted small"
          >
            {{ versionInfo.extra }}
          </div>
        </div>

        <div v-else class="text-muted">
          暂无版本信息
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
  BNavItem,
} from 'bootstrap-vue-next'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'

import { APP_VERSION } from '@/config/app'
import {
  getVersionInfoApi,
  type VersionInfo,
} from '@/api/system'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const appVersion = APP_VERSION

// 顶部一级菜单
const topMenus = [
  { key: 'overview', label: '概览', route: '/' },
  { key: 'monitor', label: '设备监控', route: '/devices' },
  { key: 'history', label: '历史查询', route: '/history' },
  { key: 'settings', label: '设置', route: '/settings/basic' },
  { key: 'maintenance', label: '维护', route: '/maintenance' },
  { key: 'wizard', label: '向导', route: '/wizard/gateway' },
] as const

type TopMenuKey = (typeof topMenus)[number]['key']

// 当前顶部菜单（用于高亮）
const activeTopMenu = computed<TopMenuKey>(() => {
  const path = route.path
  if (path.startsWith('/wizard')) return 'wizard'
  if (path.startsWith('/maintenance')) return 'maintenance'
  if (path.startsWith('/settings')) return 'settings'
  if (path.startsWith('/history')) return 'history'
  if (path.startsWith('/devices')) return 'monitor'
  return 'overview'
})

// 左侧菜单高亮
const activeSideMenu = computed(() => route.path)

// 顶部菜单点击
const onTopMenuClick = (menu: (typeof topMenus)[number]) => {
  if (route.path === menu.route) return
  router.push(menu.route)
}

// 语言
const currentLocaleLabel = computed(() => {
  const l = i18n.global.locale.value as Locale
  if (l === 'zh-CN') return '简体中文'
  if (l === 'ja') return '日本語'
  return 'English'
})

const changeLang = (lang: Locale) => {
  if (i18n.global.locale.value === lang) return
  i18n.global.locale.value = lang
  localStorage.setItem('locale', lang)
}

// 退出
const logout = () => {
  auth.logout()
  router.push('/login')
}

// 版本信息弹窗
const versionDialogVisible = ref(false)
const versionLoading = ref(false)
const versionInfo = ref<VersionInfo | null>(null)

const openVersionDialog = async () => {
  versionDialogVisible.value = true
  versionLoading.value = true
  try {
    const data = await getVersionInfoApi()
    versionInfo.value = {
      ...data,
      Version: data.Version || appVersion,
    }
  } catch (e) {
    console.error('getVersionInfo error', e)
    ElMessage.error('获取版本信息失败')
  } finally {
    versionLoading.value = false
  }
}
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
}

/* 主体 wrapper 占满宽度 */
.main-wrapper {
  width: 100%;
}

/* 左侧侧栏宽度固定 */
.sidebar-wrapper {
  width: 240px;
  min-width: 200px;
}

.app-footer {
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
}

/* 统一右上角图标大小 */
.top-icon {
  font-size: 16px;
  width: 1em;
  height: 1em;
}

/* 所有一级菜单共用的内容区域样式 */
.content-main {
  padding: 1rem;
}
</style>