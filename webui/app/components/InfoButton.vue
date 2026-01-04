<template>
  <div>
    <!-- Top-right button -->
    <UButton
      color="primary"
      variant="ghost"
      icon="i-heroicons-information-circle"
      :loading="loading && open"
      @click="onOpen"
    >
      {{ buttonText }}
    </UButton>

    <!-- Modal -->
    <UModal v-model="open">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-information-circle" class="h-5 w-5" />
              <span class="font-semibold">{{ title }}</span>
            </div>

            <UButton
              size="xs"
              color="primary"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              :loading="loading"
              @click="refresh"
            >
              刷新
            </UButton>
          </div>
        </template>

        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <USkeleton class="h-4 w-2/3" />
          <USkeleton class="h-4 w-1/2" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-4 w-2/5" />
        </div>

        <!-- Error -->
        <UAlert
          v-else-if="error"
          color="red"
          variant="soft"
          title="获取系统信息失败"
          :description="error"
        />

        <!-- Data -->
        <div v-else class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Version</span>
            <span class="font-mono text-sm">{{ info?.version ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Commit</span>
            <span class="font-mono text-sm">{{ info?.commit ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Build Time</span>
            <span class="font-mono text-sm">{{ info?.buildTime ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Server Time</span>
            <span class="font-mono text-sm">{{ info?.serverTime ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Uptime</span>
            <span class="font-mono text-sm">
              {{ info?.uptimeSec != null ? `${info.uptimeSec}s` : '-' }}
            </span>
          </div>

          <USeparator class="my-4" />

          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="solid" @click="open = false">关闭</UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
type SystemInfo = {
  version: string
  commit: string
  buildTime: string
  serverTime: string
  uptimeSec: number
}

const props = withDefaults(
  defineProps<{
    /** API endpoint, default to your server/api/v1/system.get.ts */
    endpoint?: string
    /** Button text */
    buttonText?: string
    /** Modal title */
    title?: string
    /** Open modal and ALWAYS refresh (true) or only fetch once (false) */
    alwaysRefreshOnOpen?: boolean
    /** Whether to include credentials (cookie) */
    withCredentials?: boolean
  }>(),
  {
    endpoint: '/api/system',
    buttonText: '信息',
    title: '系统信息',
    alwaysRefreshOnOpen: false,
    withCredentials: true,
  }
)

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const info = ref<SystemInfo | null>(null)

async function fetchInfo() {
  loading.value = true
  error.value = null
  try {
    info.value = await $fetch<SystemInfo>(props.endpoint, {
      method: 'GET',
      credentials: props.withCredentials ? 'include' : 'omit',
    })
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || String(e)
  } finally {
    loading.value = false
  }
}

async function refresh() {
  await fetchInfo()
}

async function onOpen() {
  open.value = true
  if (props.alwaysRefreshOnOpen || !info.value) {
    await fetchInfo()
  }
}
</script>
