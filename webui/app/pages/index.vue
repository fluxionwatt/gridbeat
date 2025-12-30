<!-- src/views/dashboard/Index.vue -->
<template>
  <div class="dashboard">
    <!-- 标题 & 时间选择 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h3 class="mb-1">
          {{ $t('dashboard.title') || '工业网关监控总览' }}
        </h3>
        <small class="text-muted">

        </small>
      </div>

      <!-- 右上角 时间范围 + 刷新 -->
      <div class="d-flex align-items-center">
        <el-date-picker
          v-model="range"
          type="datetimerange"
          range-separator="-"
          :start-placeholder="$t('common.start') || '开始时间'"
          :end-placeholder="$t('common.end') || '结束时间'"
          class="me-2"
          size="small"
        />
        <el-button size="small" @click="refresh" :loading="loading">
          {{ $t('common.refresh') || '刷新' }}
        </el-button>
      </div>
    </div>

    <!-- 概览卡片区域 -->
    <el-row :gutter="16" class="mb-3">
      <el-col :xs="12" :sm="6" v-for="card in overviewCards" :key="card.key">
        <el-card class="overview-card mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="overview-label">{{ card.label }}</div>
              <div class="overview-value">{{ card.value }}</div>
            </div>
            <div class="overview-extra text-muted">
              <small>{{ card.desc }}</small>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下半部分：左侧运行趋势 / 右侧告警列表 -->
    <el-row :gutter="16">
      <el-col :xs="24" :md="16" class="mb-3">
        <el-card class="h-100">
          <template #header>
            <div class="d-flex justify-content-between align-items-center">
              <span>
                {{ $t('dashboard.runningTrend') || '运行趋势' }}
              </span>
              <el-tag size="small" type="info">ECharts</el-tag>
            </div>
          </template>

          <!-- 运行趋势图（ECharts） -->
          <BaseChart :option="trendOption" />
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8" class="mb-3">
        <el-card class="h-100">
          <template #header>
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ $t('dashboard.alarmList') || '最新告警' }}</span>
              <el-link
                type="primary"
                @click="goAlarmPage"
                :underline="false"
                class="small"
              >
                {{ $t('dashboard.more') || '更多' }}
              </el-link>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="alarmList"
            size="small"
            border
            :header-cell-style="{ backgroundColor: '#f5f7fa' }"
          >
            <el-table-column
              prop="level"
              :label="$t('dashboard.alarmLevel') || '级别'"
              width="80"
            >
              <template #default="{ row }">
                <el-tag
                  size="small"
                  :type="row.level === 'critical'
                    ? 'danger'
                    : row.level === 'major'
                      ? 'warning'
                      : 'info'"
                >
                  {{ row.level.toUpperCase() }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="deviceName"
              :label="$t('dashboard.device') || '设备'"
              min-width="120"
              show-overflow-tooltip
            />

            <el-table-column
              prop="message"
              :label="$t('dashboard.alarmMsg') || '告警内容'"
              min-width="160"
              show-overflow-tooltip
            />

            <el-table-column
              prop="time"
              :label="$t('dashboard.time') || '时间'"
              width="150"
            />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseChart from '@/components/common/BaseChart.vue'
import {
  getDashboardApi,
  type DashboardOverview,
  type AlarmItem,
  type TrendPoint,
} from '@/api/dashboard'

const router = useRouter()

// 时间范围（默认最近 2 小时）
const now = new Date()
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
const range = ref<[Date, Date]>([twoHoursAgo, now])

const loading = ref(false)

// 概览数据
const overview = ref<DashboardOverview>({
  totalDevices: 0,
  onlineDevices: 0,
  offlineDevices: 0,
  activeAlarms: 0,
  todayEnergy: 0,
})

const overviewCards = computed(() => [
  {
    key: 'totalDevices',
    label: '总设备数',
    value: overview.value.totalDevices,
    desc: '所有工业网关 / 采集终端',
  },
  {
    key: 'onlineDevices',
    label: '在线设备',
    value: overview.value.onlineDevices,
    desc:
      overview.value.totalDevices > 0
        ? `在线率 ${(
            (overview.value.onlineDevices / overview.value.totalDevices) *
            100
          ).toFixed(1)}%`
        : '在线率 0.0%',
  },
  {
    key: 'offlineDevices',
    label: '离线设备',
    value: overview.value.offlineDevices,
    desc: '需关注的异常设备',
  },
  {
    key: 'todayEnergy',
    label: '今日累计电量 (kWh)',
    value: overview.value.todayEnergy,
    desc: '从 00:00 至今',
  },
])

// 告警列表
const alarmList = ref<AlarmItem[]>([])

// 运行趋势图表配置
const trendOption = ref<any>({
  title: {
    text: '过去 2 小时有功功率趋势',
    left: 'center',
    textStyle: {
      fontSize: 13,
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '40px',
    right: '20px',
    top: '60px',
    bottom: '40px',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[],
  },
  yAxis: {
    type: 'value',
    name: 'kW',
    axisLabel: {
      formatter: '{value}',
    },
  },
  dataZoom: [
    {
      type: 'inside',
    },
    {
      type: 'slider',
      height: 20,
      bottom: 10,
    },
  ],
  series: [
    {
      name: '有功功率',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: [] as number[],
    },
  ],
})

// 拉取数据（统一走 API，内部可 mock）
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [start, end] = range.value

    const res = await getDashboardApi({
      start: start.toISOString(),
      end: end.toISOString(),
    })

    overview.value = res.overview
    alarmList.value = res.alarms

    const trend: TrendPoint[] = res.trend || []

    trendOption.value = {
      ...trendOption.value,
      xAxis: {
        ...trendOption.value.xAxis,
        data: trend.map(t => t.time),
      },
      series: [
        {
          ...trendOption.value.series[0],
          data: trend.map(t => t.power),
        },
      ],
    }
  } finally {
    loading.value = false
  }
}

const refresh = () => {
  fetchDashboardData()
}

const goAlarmPage = () => {
  // 暂时跳到设备列表，后续可以做 /alarms 页面
  router.push('/devices')
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}

.overview-card {
  cursor: default;
}

.overview-label {
  font-size: 0.85rem;
  color: #909399;
  margin-bottom: 4px;
}

.overview-value {
  font-size: 1.6rem;
  font-weight: 600;
}
</style>