<template>
  <div class="min-h-screen">
    <!-- TopBar -->
<UHeader>
    <template #title>
      <Logo class="h-6 w-auto" />
    </template>
    <UNavigationMenu :items="items" />
    <template #right>
      <UColorModeButton />
      <UButton @click="openVersionDialog" icon="i-lucide-rocket" size="md" color="primary" variant="solid">{{ t('common.about') }}</UButton>
      <UButton color="primary" variant="ghost" icon="i-heroicons-arrow-right-on-rectangle" :loading="loggingOut" @click="onLogout">{{ t('common.logout') }}</UButton>
    </template>
</UHeader>

    <div class="flex">
      <main class="flex-1 min-w-0">
        <NuxtLayout :name="innerLayoutName">
          <NuxtPage />
        </NuxtLayout>
      </main>
    </div>
  </div>


    <!-- 版本信息弹窗 -->
    <el-dialog v-model="versionDialogVisible" title="版本信息" width="480px">
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


</template>

<script setup lang="ts">
import { useAuth, useRoute } from '#imports'
import type { NavigationMenuItem } from '@nuxt/ui'

const { signOut } = useAuth()
const route = useRoute()
const { t, locale,setLocale } = useI18n()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t('route.overview'),
    to: '/',
    active: route.path.startsWith('/')
  },
  {
    label: t('route.deviceMonitor'),
    to: '/devices',
    active: route.path.startsWith('/devices')
  },
  {
    label: t('route.history'),
    to: '/history',
    active: route.path.startsWith('/history')
  },
  {
    label: t('route.maintenance'),
    to: '/maintenance',
    active: route.path.startsWith('/maintenance')
  },
  {
    label: t('route.settings'),
    to: '/settings',
    active: route.path.startsWith('/settings')
  },
  {
    label: t('route.wizard'),
    to: '/wizard',
    active: route.path.startsWith('/wizard')
  },
])

const loggingOut = ref(false)

const innerLayoutName = computed(() => {
  const name = (route.meta as any)?.innerLayout
  return typeof name === 'string' && name.length ? name : 'dashboard-inner'
})

async function onLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await signOut({ callbackUrl: '/login' })
  } finally {
    loggingOut.value = false
  }
}

/** 版本信息，给版本弹窗用 */
export interface VersionInfo {
  productName?: string
  Version?: string
  buildTime?: string
  gitCommit?: string
  copyright?: string
  extra?: string
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
