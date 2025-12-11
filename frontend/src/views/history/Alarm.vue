<template>
  <div class="history-page">
    <el-card shadow="never">
      <template #header>
        <div class="d-flex align-items-center">
          <font-awesome-icon icon="fa-solid fa-bell" class="me-2" />
          <span>{{ t('history.alarmTitle') }}</span>
        </div>
      </template>

      <p class="text-muted small mb-3">
        {{ t('history.alarmDesc') }}
      </p>

      <!-- 这里将来可以放筛选条件 + 表格 -->
      <el-empty :description="t('history.placeholder')" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.history-page {
  width: 100%;
}
</style>