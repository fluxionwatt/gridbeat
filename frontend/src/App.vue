<template>
  <router-view v-slot="{ Component, route }">
    <component :is="getLayoutComponent(route)">
      <component :is="Component" />
    </component>
  </router-view>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const getLayoutComponent = (route: RouteLocationNormalizedLoaded) => {
  const layout = route.meta.layout
  if (layout === 'auth') return AuthLayout
  return DefaultLayout
}
</script>
