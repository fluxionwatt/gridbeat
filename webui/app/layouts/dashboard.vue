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
      <SystemInfoModalButton />

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


</template>

<script setup lang="ts">
import { useAuth, useRoute } from '#imports'
import type { NavigationMenuItem } from '@nuxt/ui'
import { fa } from 'zod/locales'

const { signOut } = useAuth()
const route = useRoute()
const { t, locale,setLocale } = useI18n()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t('route.overview'),
    to: '/',
    active: route.path === '/'
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
    children: [
      {
        label: t('route.gatewayWizard'),
        to: '/wizard/gateway',
        active: route.path.startsWith('/wizard/gateway')
      }
    ]
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
</script>
