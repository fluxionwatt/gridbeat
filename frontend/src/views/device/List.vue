<template>
  <div class="device-list">
    <!-- 顶部标题和操作区 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h3 class="mb-1">
          {{ $t('device.list') || '设备列表' }}
        </h3>
        <small class="text-muted">
          工业网关 / 采集终端统一管理
        </small>
      </div>

      <div class="d-flex">
        <el-button type="primary" class="me-2" @click="onAdd">
          新建设备
        </el-button>
        <el-button @click="fetchList" :loading="loading">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 查询条件 -->
    <el-card class="mb-3">
      <el-form
        :inline="true"
        :model="query"
        label-width="80px"
        class="d-flex flex-wrap align-items-center"
      >
        <el-form-item label="关键字" class="me-3">
          <el-input
            v-model="query.keyword"
            placeholder="设备名称 / SN / IP"
            clearable
            @keyup.enter="onSearch"
          />
        </el-form-item>

        <el-form-item label="状态" class="me-3">
          <el-select
            v-model="query.status"
            placeholder="全部"
            clearable
            style="width: 160px"
          >
            <el-option label="全部" :value="''" />
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="告警" value="alarm" />
          </el-select>
        </el-form-item>

        <el-form-item label="分组" class="me-3">
          <el-select
            v-model="query.group"
            placeholder="全部分组"
            clearable
            style="width: 180px"
          >
            <el-option label="全部" :value="''" />
            <el-option label="主变电站" value="substation" />
            <el-option label="厂区屋顶" value="roof" />
            <el-option label="储能区" value="ess" />
          </el-select>
        </el-form-item>

        <div class="ms-auto">
          <el-button type="primary" class="me-2" @click="onSearch">
            查询
          </el-button>
          <el-button @click="onReset">
            重置
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        :header-cell-style="{ backgroundColor: '#f5f7fa' }"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="设备名称"
          min-width="160"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-link type="primary" @click="onView(row)">
              {{ row.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="sn"
          label="SN"
          min-width="150"
          show-overflow-tooltip
        />

        <el-table-column
          prop="ip"
          label="IP 地址"
          width="140"
        />

        <el-table-column
          prop="groupName"
          label="分组"
          width="120"
        />

        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template #default="{ row }">
            <el-tag
              v-if="row.status === 'online'"
              size="small"
              type="success"
            >
              在线
            </el-tag>
            <el-tag
              v-else-if="row.status === 'offline'"
              size="small"
              type="info"
            >
              离线
            </el-tag>
            <el-tag
              v-else-if="row.status === 'alarm'"
              size="small"
              type="danger"
            >
              告警
            </el-tag>
            <el-tag v-else size="small">
              未知
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="lastSeen"
          label="最后心跳时间"
          width="180"
        />

        <el-table-column
          prop="firmware"
          label="固件版本"
          width="140"
          show-overflow-tooltip
        />

        <el-table-column
          label="操作"
          fixed="right"
          width="260"
        >
          <template #default="{ row }">
            <el-button
              link
              size="small"
              type="primary"
              @click="onView(row)"
            >
              详情
            </el-button>
            <el-button
              link
              size="small"
              type="primary"
              @click="onEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              link
              size="small"
              type="warning"
              @click="onRemoteConfig(row)"
            >
              远程配置
            </el-button>
            <el-button
              link
              size="small"
              type="danger"
              @click="onDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="d-flex justify-content-end mt-3">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getDeviceListApi,
  type DeviceItem,
} from '@/api/device'

const router = useRouter()

// 查询条件
const query = reactive({
  keyword: '',
  status: '',
  group: '',
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const loading = ref(false)
const tableData = ref<DeviceItem[]>([])

// 从 API 获取列表（mock 或真实接口由 VITE_USE_MOCK 控制）
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getDeviceListApi({
      keyword: query.keyword,
      status: query.status,
      group: query.group,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = res.items
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  pagination.page = 1
  fetchList()
}

const onReset = () => {
  query.keyword = ''
  query.status = ''
  query.group = ''
  pagination.page = 1
  fetchList()
}

const onPageChange = (page: number) => {
  pagination.page = page
  fetchList()
}

const onPageSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchList()
}

const onAdd = () => {
  // 这里可以跳到新建设备页面
  ElMessage.info('这里可以跳转到新建设备页面')
}

const onView = (row: DeviceItem) => {
  router.push({
    name: 'DeviceDetail',
    params: { id: row.id },
  })
}

const onEdit = (row: DeviceItem) => {
  ElMessage.info(`编辑设备：${row.name}（TODO：接编辑页面/弹窗）`)
}

const onRemoteConfig = (row: DeviceItem) => {
  ElMessage.info(`远程配置设备：${row.name}（TODO：接远程指令下发 API）`)
}

const onDelete = (row: DeviceItem) => {
  ElMessageBox.confirm(
    `确定要删除设备「${row.name}」吗？删除后该网关上报的数据将不再接收。`,
    '删除确认',
    {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    },
  )
    .then(() => {
      // TODO: 调用删除接口，目前前端直接刷新
      ElMessage.success('删除成功（示例：接入真实 API 后请替换实现）')
      fetchList()
    })
    .catch(() => {
      // 取消
    })
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.device-list {
  min-height: 100%;
}
</style>