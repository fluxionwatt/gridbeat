<script setup lang="ts">
const { data: me } = await useAPI<{ id: string; username: string; role: string }>('/me')

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', data: [12, 18, 9, 22, 30, 26], smooth: true, name: 'Power(kW)' },
  ],
}))
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <el-card>
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <div>Overview</div>
            <div class="text-muted" style="font-size: 12px;">{{ me?.username }}</div>
          </div>
        </template>

        <VChart :option="option" autoresize style="height: 320px;" />
      </el-card>
    </el-col>
  </el-row>
</template>