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
const route = useRoute()

const collapsed = ref(false)

const items: NavigationMenuItem[][] = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  active: route.path === '/monitor',
  to: '/monitor',
}, {
  label: 'Channel',
  icon: 'i-lucide-users',
  active: route.path === '/monitor/channel',
  to: '/monitor/channel',
}]]
</script>

