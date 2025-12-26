<script setup lang="ts">
type Device = { id: string; name: string; protocol: 'modbus-rtu' | 'modbus-tcp'; online: boolean }

const { data, pending, refresh } = await useAPI<Device[]>('/devices', { default: () => [] })
</script>

<template>
  <el-card>
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <div>Devices</div>
        <el-button size="small" @click="refresh()">Refresh</el-button>
      </div>
    </template>

    <el-table :data="data" v-loading="pending" style="width: 100%">
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="protocol" label="Protocol" width="140" />
      <el-table-column label="Online" width="120">
        <template #default="{ row }">
          <el-tag :type="row.online ? 'success' : 'info'">{{ row.online ? 'Online' : 'Offline' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>