<!-- src/views/settings/Basic.vue -->
<template>
  <div class="settings-basic">
    <!-- 标题区 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="mb-1">基本设置</h4>
        <small class="text-muted">
          配置网关名称、时区、对时方式和系统选项，这些配置会影响整个平台显示和时间同步。
        </small>
      </div>
    </div>

    <!-- 内容区：左基本信息 + 右系统选项 -->
    <el-row :gutter="16">
      <!-- 基本信息 -->
      <el-col :md="14" :sm="24">
        <el-card shadow="never" class="mb-3">
          <template #header>
            <div class="d-flex align-items-center">
              <font-awesome-icon icon="fa-solid fa-sliders" class="me-2" />
              <span>网关基本信息</span>
            </div>
          </template>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="120px"
            :disabled="loading"
          >
            <el-form-item label="网关名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="例如：厂区1号工业网关"
              />
            </el-form-item>

            <!-- 安装位置已移除 -->

            <el-form-item label="时区" prop="timezone">
              <el-select
                v-model="form.timezone"
                placeholder="请选择时区"
                filterable
                :loading="tzLoading"
              >
                <el-option
                  v-for="tz in timezones"
                  :key="tz"
                  :label="tz"
                  :value="tz"
                />
              </el-select>
            </el-form-item>

            <!-- 是否对时（勾选） -->
            <el-form-item label="是否对时">
              <el-checkbox v-model="form.timeSyncEnabled">
                启用 NTP 对时
              </el-checkbox>
            </el-form-item>

            <!-- 勾选：NTP 服务器 -->
            <el-form-item
              v-if="form.timeSyncEnabled"
              label="NTP 服务器"
            >
              <el-input
                v-model="form.ntpServer"
                placeholder="例如：ntp.aliyun.com"
              />
            </el-form-item>

            <!-- 未勾选：手动日期时间 -->
            <el-form-item
              v-else
              label="日期时间"
            >
              <el-date-picker
                v-model="manualDateTime"
                type="datetime"
                placeholder="选择日期与时间"
                style="width: 100%;"
              />
              <div class="text-muted small mt-1">
                关闭 NTP 对时后，将按此处的时间设置网关本地时间。
              </div>
            </el-form-item>

            <el-form-item label="描述">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="对本网关的备注说明（可选）"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 系统选项 -->
      <el-col :md="10" :sm="24">
        <el-card shadow="never" class="mb-3">
          <template #header>
            <div class="d-flex align-items-center">
              <font-awesome-icon icon="fa-solid fa-gear" class="me-2" />
              <span>系统选项</span>
            </div>
          </template>

          <el-form
            :model="form"
            label-width="120px"
            :disabled="loading"
          >
            <!-- 默认语言选项已移除 -->

            <el-form-item label="登录超时">
              <el-input-number
                v-model="form.sessionTimeoutMinutes"
                :min="5"
                :max="720"
              />
              <span class="text-muted ms-2 small">分钟</span>
            </el-form-item>

            <el-form-item label="允许远程管理">
              <el-switch v-model="form.remoteManageEnabled" />
            </el-form-item>
          </el-form>

          <el-alert
            type="info"
            :closable="false"
            show-icon
            class="mt-2"
            description="这些选项会影响会话超时和远程管理策略，修改后建议重登一次。"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部操作按钮 -->
    <div class="d-flex justify-content-end mt-2">
      <el-button :disabled="loading" @click="reset">
        重置
      </el-button>
      <el-button
        type="primary"
        :loading="saving"
        class="ms-2"
        @click="submit"
      >
        <font-awesome-icon icon="fa-solid fa-floppy-disk" class="me-1" />
        保存配置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  getBasicSettings,
  saveBasicSettings,
  getTimezones,
  type BasicSettings,
} from '@/api/settings'

import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const saving = ref(false)

// 时区列表由后端提供（或 mock）
const timezones = ref<string[]>([])
const tzLoading = ref(false)

// 手动时间本地状态（用 Date，提交时转成字符串）
const manualDateTime = ref<Date | null>(null)

// 表单数据
const form = reactive<BasicSettings>({
  name: '',
  timezone: 'Asia/Phnom_Penh',
  timeSyncEnabled: true,
  ntpServer: 'ntp.aliyun.com',
  manualDateTime: '',
  description: '',
  defaultLocale: 'zh-CN', // 接口里仍可以有这个字段，但前端不展示
  sessionTimeoutMinutes: 30,
  remoteManageEnabled: true,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入网关名称', trigger: 'blur' }],
  timezone: [{ required: true, message: '请选择时区', trigger: 'change' }],
}

// 从 API（或 mock）拉取时区列表
const loadTimezones = async () => {
  tzLoading.value = true
  try {
    const data = await getTimezones()
    timezones.value = data

    if (form.timezone && !timezones.value.includes(form.timezone)) {
      timezones.value = [form.timezone, ...timezones.value]
    }
  } finally {
    tzLoading.value = false
  }
}

// 加载基本配置
const loadSettings = async () => {
  loading.value = true
  try {
    const data = await getBasicSettings()
    Object.assign(form, data)

    // 初始化手动时间本地状态
    if (form.manualDateTime) {
      const d = new Date(form.manualDateTime)
      if (!isNaN(d.getTime())) {
        manualDateTime.value = d
      } else {
        manualDateTime.value = null
      }
    } else {
      manualDateTime.value = null
    }

    // 同步一次时区列表（确保当前时区可选）
    if (form.timezone && !timezones.value.includes(form.timezone)) {
      timezones.value = [form.timezone, ...timezones.value]
    }

    if (form.sessionTimeoutMinutes) {
        auth.setSessionTimeout(form.sessionTimeoutMinutes)
    }
  } finally {
    loading.value = false
  }
}

//const reload = () => {
 // loadSettings()
//}

const reset = () => {
  loadSettings()
}

// 保存配置
const submit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  // 根据对时方式处理字段
  if (form.timeSyncEnabled) {
    // 使用 NTP，对手动时间清空
    form.manualDateTime = ''
  } else {
    // 使用手动时间，对 NTP 服务可选/忽略；手动时间转为 ISO 字符串
    if (manualDateTime.value) {
      form.manualDateTime = manualDateTime.value.toISOString()
    } else {
      form.manualDateTime = ''
    }
  }

  saving.value = true
  try {
    await saveBasicSettings(form)
    auth.setSessionTimeout(form.sessionTimeoutMinutes)
    ElMessage.success('配置保存成功')
  } catch (e) {
    console.error(e)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  // 时区 & 基本配置并行加载
  loadTimezones()
  loadSettings()
})
</script>

<style scoped>
.settings-basic {
  width: 100%;
}
</style>