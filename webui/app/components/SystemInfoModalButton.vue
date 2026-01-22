<!-- app/components/SystemInfoModalButton.vue -->
<template>
  <UModal
    v-model:open="open"
    title="系统信息"
    description="版本与构建信息"
    :ui="{ footer: 'justify-end' }"
  >
    <!-- Trigger -->
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-heroicons-information-circle"
      @click="open = true"
    >
       {{ t('common.about') }}
    </UButton>

    <!-- Body -->
    <template #body>
      <div v-if="loading" class="space-y-3">
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="h-4 w-1/2" />
        <USkeleton class="h-4 w-3/4" />
      </div>

      <UAlert
        v-else-if="error"
        color="red"
        variant="soft"
        title="获取失败"
        :description="error"
      />

      <div v-else class="space-y-3">
        <div class="grid grid-cols-1 gap-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Mode</span>
            <span class="font-mono text-sm">{{ info?.mode ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Version</span>
            <span class="font-mono text-sm">{{ info?.version ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Commit</span>
            <span class="font-mono text-sm">{{ info?.commit ?? '-' }}</span>
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Build Time</span>
            <span class="font-mono text-sm">{{ info?.buildTime ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Server Time</span>
            <span class="font-mono text-sm">{{ info?.serverTime ?? '-' }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">Uptime</span>
            <span class="font-mono text-sm">
              {{ info?.uptimeSec != null ? `${info.uptimeSec}s` : '-' }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Footer -->
    <template #footer="{ close }">
      <div class="flex gap-2">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-path"
          :loading="loading"
          @click="refresh"
        >
          刷新
        </UButton>

        <UButton color="neutral" @click="close">关闭</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">

const { t, locale,setLocale } = useI18n()


type SystemInfo = {
  version: string
  commit: string
  buildTime: string
  serverTime: string
  uptimeSec: number
  mode?: 'mock' | 'real'
}

type ApiResp<T> = { data: T }

const props = withDefaults(
  defineProps<{
    /** 强制 mock：追加 ?mock=1 */
    forceMock?: boolean
    /** 每次打开都刷新 */
    alwaysRefreshOnOpen?: boolean
  }>(),
  {
    forceMock: false,
    alwaysRefreshOnOpen: false,
  }
)

const api = useApi()

const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const info = ref<SystemInfo | null>(null)

async function fetchSystem() {

  loading.value = true
  error.value = null
  try {
    const resp = await api<ApiResp<SystemInfo>>("/system/version", { method: 'GET' })
    info.value = resp.data
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || String(e)
  } finally {
    loading.value = false
  }
}

async function refresh() {
  await fetchSystem()
}

watch(open, async (v) => {
  if (!v) return
  if (props.alwaysRefreshOnOpen || !info.value) {
    await fetchSystem()
  }
})
</script>