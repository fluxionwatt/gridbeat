<!-- src/views/maintenance/Index.vue -->
<template>
  <div class="maintenance-index">
    <!-- 维护概览主卡片 -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <div class="d-flex align-items-center">
          <font-awesome-icon icon="fa-solid fa-gear" class="me-2" />
          <span>{{ t('route.maintenance') }}</span>
        </div>
      </template>

      <p class="text-muted small mb-3">
        {{ t('maintenance.overviewDesc', { seconds: intervalSeconds, points: maxPoints }) }}
      </p>

      <el-row :gutter="16" class="w-100">
        <!-- 系统运行时间 -->
        <el-col :md="8" :sm="24" class="mb-3">
          <el-card shadow="never" class="h-100">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span>{{ t('maintenance.uptimeTitle') }}</span>
              <font-awesome-icon icon="fa-solid fa-circle-info" class="text-muted small" />
            </div>
            <div class="fw-bold" style="min-height: 1.5em;">
              {{ uptimeText || '--' }}
            </div>
            <div class="text-muted small mt-1">
              {{ t('maintenance.uptimeHint', { seconds: intervalSeconds }) }}
            </div>
          </el-card>
        </el-col>

        <!-- CPU / 内存 + 小图表 -->
        <el-col :md="8" :sm="24" class="mb-3">
          <el-card shadow="never" class="h-100">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span>{{ t('maintenance.cpuMemTitle') }}</span>
              <font-awesome-icon icon="fa-solid fa-server" class="text-muted small" />
            </div>

            <div class="fw-bold mb-1" style="min-height: 1.5em;">
              {{ t('maintenance.cpuMemValue', {
                cpu: cpuUsageDisplay,
                mem: memUsageDisplay,
              }) }}
            </div>

            <div
              ref="cpuMemChartRef"
              class="cpu-mem-chart"
            />

            <div class="text-muted small mt-1">
              {{ t('maintenance.cpuMemHint', { points: maxPoints, seconds: intervalSeconds }) }}
            </div>
          </el-card>
        </el-col>

        <!-- 服务状态 -->
        <el-col :md="8" :sm="24" class="mb-3">
          <el-card shadow="never" class="h-100">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span>{{ t('maintenance.serviceTitle') }}</span>
              <font-awesome-icon icon="fa-solid fa-plug" class="text-muted small" />
            </div>

            <div class="mb-2">
              <el-tag
                v-for="svc in serviceStatus"
                :key="svc.name"
                :type="svcTagType(svc.status)"
                class="me-1 mb-1"
                effect="light"
              >
                {{ svc.name }}：{{ svcStatusText(svc.status) }}
              </el-tag>
              <div
                v-if="!serviceStatus.length"
                class="text-muted small"
              >
                {{ t('maintenance.noService') }}
              </div>
            </div>

            <div class="text-muted small mt-1">
              {{ t('maintenance.serviceHint', { seconds: intervalSeconds }) }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 维护操作记录 -->
    <el-card shadow="never">
      <template #header>
        <div class="d-flex align-items-center">
          <font-awesome-icon icon="fa-solid fa-list" class="me-2" />
          <span>{{ t('maintenance.logTitle') }}</span>
        </div>
      </template>

      <div class="text-muted small">
        {{ t('maintenance.logHint') }}
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  nextTick,
} from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import {
  getMaintenanceOverviewApi,
  type MaintenanceOverviewResponse,
  type ServiceStatus,
} from '@/api/maintenance'

const route = useRoute()
const { t } = useI18n()

// 刷新间隔 / 历史打点
const intervalSeconds = 30
const maxPoints = 120

// 状态数据
const uptimeText = ref('')
const cpuUsage = ref<number | null>(null)
const memUsage = ref<number | null>(null)

const cpuHistory = ref<number[]>([])
const memHistory = ref<number[]>([])

const serviceStatus = ref<ServiceStatus[]>([])

const cpuUsageDisplay = computed(() =>
  cpuUsage.value == null ? '--%' : `${cpuUsage.value.toFixed(1)}%`,
)
const memUsageDisplay = computed(() =>
  memUsage.value == null ? '--%' : `${memUsage.value.toFixed(1)}%`,
)

let pollTimer: number | null = null

// 工具函数
const formatUptime = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '--'
  const days = Math.floor(seconds / (24 * 3600))
  const hours = Math.floor((seconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []
  if (days) parts.push(t('maintenance.uptimeDays', { days }))
  if (hours) parts.push(t('maintenance.uptimeHours', { hours }))
  if (minutes) parts.push(t('maintenance.uptimeMinutes', { minutes }))
  if (!days && !hours && !minutes && secs) {
    parts.push(t('maintenance.uptimeSeconds', { seconds: secs }))
  }
  return parts.join(' ') || t('maintenance.uptimeSeconds', { seconds: secs })
}

const pushHistory = (arr: number[], value: number) => {
  arr.push(value)
  if (arr.length > maxPoints) {
    arr.shift()
  }
}

// API 轮询
const fetchOverview = async () => {
  try {
    const data: MaintenanceOverviewResponse = await getMaintenanceOverviewApi()

    uptimeText.value = formatUptime(data.uptimeSeconds)
    cpuUsage.value = data.cpuUsage
    memUsage.value = data.memUsage

    if (typeof data.cpuUsage === 'number') {
      pushHistory(cpuHistory.value, data.cpuUsage)
    }
    if (typeof data.memUsage === 'number') {
      pushHistory(memHistory.value, data.memUsage)
    }

    serviceStatus.value = data.services || []

    updateCpuMemChart()
  } catch (e) {
    console.error('fetchOverview error:', e)
  }
}

// ECharts
const cpuMemChartRef = ref<HTMLDivElement | null>(null)
let cpuMemChart: echarts.ECharts | null = null

const resizeHandler = () => {
  cpuMemChart?.resize()
}

const initCpuMemChart = () => {
  if (!cpuMemChartRef.value) return
  if (cpuMemChart) return

  cpuMemChart = echarts.init(cpuMemChartRef.value)
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', resizeHandler)
  }
  updateCpuMemChart()
}

const updateCpuMemChart = () => {
  if (!cpuMemChart) return

  const cpuData = cpuHistory.value
  const memData = memHistory.value

  const length = Math.max(cpuData.length, memData.length)
  const xData = Array.from({ length }, (_, i) => `${i + 1}`)

  cpuMemChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: [t('maintenance.cpuLegend'), t('maintenance.memLegend')],
    },
    grid: {
      left: 30,
      right: 10,
      top: 30,
      bottom: 20,
    },
    xAxis: {
      type: 'category',
      data: xData,
      show: false,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: t('maintenance.cpuLegend'),
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: cpuData,
      },
      {
        name: t('maintenance.memLegend'),
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: memData,
      },
    ],
  })
}

// 服务状态显示
const svcTagType = (status: ServiceStatus['status']) => {
  if (status === 'up') return 'success'
  if (status === 'degraded') return 'warning'
  return 'danger'
}

const svcStatusText = (status: ServiceStatus['status']) => {
  if (status === 'up') return t('maintenance.serviceStatus.up')
  if (status === 'degraded') return t('maintenance.serviceStatus.degraded')
  return t('maintenance.serviceStatus.down')
}

// 生命周期
onMounted(async () => {
  await nextTick()
  initCpuMemChart()

  // 进入页面先拉一次
  fetchOverview()

  // 每 intervalSeconds 轮询一次（只在 /maintenance 下）
  pollTimer = window.setInterval(() => {
    if (route.path.startsWith('/maintenance')) {
      fetchOverview()
    }
  }, intervalSeconds * 1000) as unknown as number
})

onBeforeUnmount(() => {
  if (pollTimer != null) {
    clearInterval(pollTimer)
    pollTimer = null
  }

  if (cpuMemChart) {
    try {
      cpuMemChart.dispose()
    } catch {
      // ignore
    } finally {
      cpuMemChart = null
    }
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style scoped>
.maintenance-index {
  width: 100%;
}

.cpu-mem-chart {
  width: 100%;
  height: 140px;
}
</style>