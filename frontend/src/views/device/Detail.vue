<template>
  <div class="device-detail">
    <!-- 顶部标题 + 返回 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <el-button link @click="goBack">
          ← 返回列表
        </el-button>
        <h3 class="mb-1">
          设备详情
          <span v-if="device" class="text-muted fs-6 ms-2">
            （{{ device.name }}）
          </span>
        </h3>
        <small class="text-muted">
          查看并配置工业网关的基础信息、通讯通道与运行状态
        </small>
      </div>

      <div class="d-flex">
        <el-button class="me-2" @click="onReboot" :loading="opLoading.reboot">
          远程重启
        </el-button>
        <el-button class="me-2" @click="onSyncConfig" :loading="opLoading.sync">
          下发配置
        </el-button>
        <el-button type="primary" @click="onEdit">
          编辑信息
        </el-button>
      </div>
    </div>

    <el-card v-if="device" class="mb-3">
      <!-- 基本信息 -->
      <div class="mb-3">
        <h5 class="mb-2">基础信息</h5>
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="设备名称">
            {{ device.name }}
          </el-descriptions-item>
          <el-descriptions-item label="SN">
            {{ device.sn }}
          </el-descriptions-item>
          <el-descriptions-item label="设备分组">
            {{ device.groupName }}
          </el-descriptions-item>

          <el-descriptions-item label="IP 地址">
            {{ device.ip }}
          </el-descriptions-item>
          <el-descriptions-item label="固件版本">
            {{ device.firmware }}
          </el-descriptions-item>
          <el-descriptions-item label="在线状态">
            <el-tag
              v-if="device.status === 'online'"
              type="success"
              size="small"
            >
              在线
            </el-tag>
            <el-tag
              v-else-if="device.status === 'offline'"
              type="info"
              size="small"
            >
              离线
            </el-tag>
            <el-tag
              v-else-if="device.status === 'alarm'"
              type="danger"
              size="small"
            >
              告警
            </el-tag>
            <el-tag v-else size="small">
              未知
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="最后心跳">
            {{ device.lastSeen }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ device.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            {{ device.remark || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- Tab 区域：通讯配置 / 实时状态 / 告警 / 日志 -->
    <el-card v-if="device">
      <el-tabs v-model="activeTab">
        <!-- 通讯配置 -->
        <el-tab-pane label="通讯配置" name="comm">
          <div class="mb-2 d-flex justify-content-between align-items-center">
            <span class="text-muted">Modbus / IEC104 / MQTT 通讯通道概览（示例）</span>
            <el-button type="primary" link @click="onEditChannels">
              编辑通道
            </el-button>
          </div>

          <el-table
            :data="channels"
            border
            size="small"
            :header-cell-style="{ backgroundColor: '#f5f7fa' }"
          >
            <el-table-column prop="type" label="协议" width="120" />
            <el-table-column prop="name" label="通道名称" min-width="160" />
            <el-table-column prop="direction" label="方向" width="120" />
            <el-table-column prop="endpoint" label="本地端点 / 远端地址" min-width="200" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag
                  v-if="row.status === 'connected'"
                  type="success"
                  size="small"
                >
                  已连接
                </el-tag>
                <el-tag
                  v-else-if="row.status === 'disconnected'"
                  type="info"
                  size="small"
                >
                  未连接
                </el-tag>
                <el-tag
                  v-else
                  type="warning"
                  size="small"
                >
                  未知
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastError" label="最近错误" min-width="200" />
          </el-table>
        </el-tab-pane>

        <!-- 实时状态 -->
        <el-tab-pane label="实时状态" name="realtime">
          <div class="mb-2 text-muted">
            这里可以接实时数据（电压、电流、有功/无功功率、SOC 等），当前为占位示例。
          </div>

          <el-row :gutter="16">
            <el-col :xs="24" :md="8" class="mb-3">
              <el-card>
                <div class="mb-1 text-muted small">有功功率（kW）</div>
                <div class="fs-3 fw-bold">
                  {{ realtime.activePower.toFixed(1) }}
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :md="8" class="mb-3">
              <el-card>
                <div class="mb-1 text-muted small">电网电压（V）</div>
                <div class="fs-3 fw-bold">
                  {{ realtime.gridVoltage.toFixed(0) }}
                </div>
              </el-card>
            </el-col>
            <el-col :xs="24" :md="8" class="mb-3">
              <el-card>
                <div class="mb-1 text-muted small">设备温度（℃）</div>
                <div class="fs-3 fw-bold">
                  {{ realtime.temperature.toFixed(1) }}
                </div>
              </el-card>
            </el-col>
          </el-row>

          <div class="text-muted small">
            * 可根据实际项目替换为图表（ECharts）或更多状态指标。
          </div>
        </el-tab-pane>

        <!-- 告警 -->
        <el-tab-pane label="告警记录" name="alarms">
          <el-table
            :data="alarms"
            size="small"
            border
            :header-cell-style="{ backgroundColor: '#f5f7fa' }"
          >
            <el-table-column prop="level" label="级别" width="100">
              <template #default="{ row }">
                <el-tag
                  v-if="row.level === 'critical'"
                  type="danger"
                  size="small"
                >
                  严重
                </el-tag>
                <el-tag
                  v-else-if="row.level === 'major'"
                  type="warning"
                  size="small"
                >
                  重要
                </el-tag>
                <el-tag
                  v-else
                  type="info"
                  size="small"
                >
                  提示
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="告警码" width="120" />
            <el-table-column prop="message" label="告警描述" min-width="220" show-overflow-tooltip />
            <el-table-column prop="startTime" label="开始时间" width="180" />
            <el-table-column prop="endTime" label="结束时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag
                  v-if="row.status === 'active'"
                  size="small"
                  type="danger"
                >
                  未恢复
                </el-tag>
                <el-tag
                  v-else
                  size="small"
                  type="success"
                >
                  已恢复
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 系统日志 -->
        <el-tab-pane label="系统日志" name="logs">
          <el-table
            :data="logs"
            size="small"
            border
            :header-cell-style="{ backgroundColor: '#f5f7fa' }"
          >
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="level" label="级别" width="100" />
            <el-table-column prop="module" label="模块" width="140" />
            <el-table-column prop="message" label="内容" min-width="260" show-overflow-tooltip />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-empty v-if="!device && !loading" description="未找到设备" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getDeviceDetailApi,
  type DeviceDetail,
} from '@/api/device'

const route = useRoute()
const router = useRouter()

const deviceId = route.params.id as string | undefined
const loading = ref(false)

const device = ref<DeviceDetail | null>(null)
const activeTab = ref<'comm' | 'realtime' | 'alarms' | 'logs'>('comm')

// 通道配置 mock
const channels = ref([
  {
    type: 'Modbus-RTU',
    name: '下挂电表 RS485-1',
    direction: '主站',
    endpoint: '串口 /dev/ttyS1, 9600,N,8,1',
    status: 'connected',
    lastError: '',
  },
  {
    type: 'Modbus-TCP',
    name: '上报 EMS',
    direction: '从站',
    endpoint: '0.0.0.0:502',
    status: 'connected',
    lastError: '',
  },
  {
    type: 'MQTT',
    name: '云平台通道',
    direction: '上行',
    endpoint: 'mqtts://ems.example.com:8883',
    status: 'disconnected',
    lastError: 'TLS 握手失败（示例）',
  },
])

// 实时状态 mock
const realtime = reactive({
  activePower: 123.4,
  gridVoltage: 400,
  temperature: 36.5,
})

// 告警 mock
const alarms = ref([
  {
    level: 'critical',
    code: 'ALM-PCS-OT',
    message: 'PCS 逆变模块过温',
    startTime: '2025-11-21 10:20:00',
    endTime: '',
    status: 'active',
  },
  {
    level: 'major',
    code: 'ALM-COMM-LOSS',
    message: 'Modbus-RTU 通讯中断超过 5 分钟',
    startTime: '2025-11-21 09:30:13',
    endTime: '2025-11-21 09:42:01',
    status: 'resolved',
  },
])

// 日志 mock
const logs = ref([
  {
    time: '2025-11-21 10:30:01',
    level: 'INFO',
    module: 'system',
    message: '设备启动完成，进入运行状态',
  },
  {
    time: '2025-11-21 10:20:21',
    level: 'WARN',
    module: 'pcs',
    message: '检测到温度接近上限阈值',
  },
  {
    time: '2025-11-21 10:20:30',
    level: 'ERROR',
    module: 'pcs',
    message: 'PCS 逆变模块过温，触发告警 ALM-PCS-OT',
  },
])

const fetchDetail = async () => {
  if (!deviceId) return
  loading.value = true
  try {
    device.value = await getDeviceDetailApi(deviceId)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/devices')
}

const opLoading = reactive({
  reboot: false,
  sync: false,
})

const onReboot = async () => {
  if (!device.value) return
  opLoading.reboot = true
  try {
    // TODO: 调用远程重启接口
    ElMessage.success('已下发远程重启指令（示例）')
  } finally {
    opLoading.reboot = false
  }
}

const onSyncConfig = async () => {
  if (!device.value) return
  opLoading.sync = true
  try {
    // TODO: 调用配置下发接口
    ElMessage.success('已下发配置同步指令（示例）')
  } finally {
    opLoading.sync = false
  }
}

const onEdit = () => {
  if (!device.value) return
  ElMessage.info('这里可以弹出编辑设备信息的表单 / 跳转到编辑页面')
}

const onEditChannels = () => {
  ElMessage.info('这里可以进入通道配置页面，例如 Modbus/IEC104/MQTT 的详细参数配置')
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.device-detail {
  min-height: 100%;
}
.fs-6 {
  font-size: 0.9rem;
}
</style>