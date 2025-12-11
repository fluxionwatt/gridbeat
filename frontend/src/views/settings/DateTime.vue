<template>
  <div class="settings-page">
    <el-card shadow="never">
      <template #header>
        <div class="d-flex align-items-center">
          <font-awesome-icon icon="fa-solid fa-clock" class="me-2" />
          <span>{{ t('settings.dateTimeTitle') }}</span>
        </div>
      </template>

      <p class="text-muted small mb-3">
        {{ t('settings.dateTimeDesc') }}
      </p>

      <el-empty :description="t('settings.placeholder')" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.settings-page {
  width: 100%;
}
</style>