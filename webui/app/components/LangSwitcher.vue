<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <el-select v-model="model" size="small" style="width: 120px;">
    <el-option label="中文" value="zh" />
    <el-option label="English" value="en" />
    <el-option label="日本語" value="ja" />
  </el-select>
</template>