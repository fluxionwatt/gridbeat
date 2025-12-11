<template>
  <div class="history-page">
    <el-card shadow="never">
      <template #header>
        <div class="d-flex align-items-center">
          <font-awesome-icon icon="fa-solid fa-file-export" class="me-2" />
          <span>{{ t('history.exportTitle') }}</span>
        </div>
      </template>

      <p class="text-muted small mb-3">
        {{ t('history.exportDesc') }}
      </p>

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