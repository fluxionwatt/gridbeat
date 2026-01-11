<template>
  <div class="p-4">
    <UDashboardGroup>
  <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
    <template #header="{ collapsed }">
      <Logo v-if="!collapsed" class="h-5 w-auto shrink-0" />
      <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
      />
    </template>
  </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
  </div>
</template>



<script setup lang="ts">

import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const route = useRoute()
const collapsed = ref(true)

const items: NavigationMenuItem[][] = [[{
  label: t('settings.basic'),
  icon: 'i-lucide-house',
  to: '/settings/basic',
}, {
  label: t('settings.channel'),
  icon: 'i-lucide-users',
  to: '/settings/channel',
}]]
</script>

