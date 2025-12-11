<template>
  <div class="gateway-wizard">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center">
        <font-awesome-icon
          icon="fa-solid fa-wand-magic-sparkles"
          class="me-2 text-primary"
        />
        <div>
          <h4 class="mb-0">开局向导</h4>
          <small class="text-muted">
            按步骤完成基本配置、网络设置、南向设备和北向通讯，一键完成开局调测。
          </small>
        </div>
      </div>

      <el-button text type="primary" @click="goOverview">
        <font-awesome-icon icon="fa-solid fa-gauge" class="me-1" />
        跳过向导，进入概览
      </el-button>
    </div>

    <el-card class="mb-3">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="基本信息" />
        <el-step title="网络配置" />
        <el-step title="南向设备" />
        <el-step title="北向通讯" />
        <el-step title="完成" />
      </el-steps>
    </el-card>

    <el-card>
      <template v-if="activeStep === 0">
        <h5 class="mb-3">基本信息</h5>
        <!-- 这里省略，保持和你现在的一样即可 -->
        <div class="text-muted">这里放你的表单内容...</div>
      </template>

      <template v-else-if="activeStep === 1">
        <h5 class="mb-3">网络配置</h5>
        <div class="text-muted">这里放你的网络配置表单...</div>
      </template>

      <template v-else-if="activeStep === 2">
        <h5 class="mb-3">南向设备</h5>
        <div class="text-muted">这里放你的南向设备配置...</div>
      </template>

      <template v-else-if="activeStep === 3">
        <h5 class="mb-3">北向通讯</h5>
        <div class="text-muted">这里放你的北向通讯配置...</div>
      </template>

      <template v-else>
        <div class="text-center py-5">
          <el-result
            icon="success"
            title="调测完成"
            sub-title="初始配置已保存生效。"
          >
            <template #extra>
              <el-space>
                <el-button type="primary" @click="goOverview">
                  前往概览
                </el-button>
                <el-button @click="resetWizard">
                  重新调测
                </el-button>
              </el-space>
            </template>
          </el-result>
        </div>
      </template>

      <template v-if="activeStep < 4">
        <el-divider />
        <div class="d-flex justify-content-between">
          <el-button :disabled="activeStep === 0" @click="prevStep">
            上一步
          </el-button>
          <el-button type="primary" @click="nextStep">
            下一步
          </el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeStep = ref(0)

const prevStep = () => {
  if (activeStep.value > 0) activeStep.value--
}
const nextStep = () => {
  if (activeStep.value < 4) activeStep.value++
}
const resetWizard = () => {
  activeStep.value = 0
}
const goOverview = () => {
  router.push('/')
}
</script>

<style scoped>
.gateway-wizard {
  width: 100%;
}
</style>