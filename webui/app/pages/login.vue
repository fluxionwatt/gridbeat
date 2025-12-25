<script setup lang="ts">
definePageMeta({ layout: 'blank', public: true })

const { locale } = useI18n()
const auth = useAuthStore()
const route = useRoute()

const form = reactive({
  username: 'admin',
  password: 'admin',
})

const loading = ref(false)
const err = ref<string | null>(null)

async function onLogin() {
  err.value = null
  loading.value = true
  try {
    await auth.login(form.username, form.password)
    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(redirect)
  } catch (e: any) {
    err.value = e?.data?.message || e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-sm" style="width: 420px;">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="m-0">Gateway Admin</h4>
          <LangSwitcher v-model="locale" />
        </div>

        <el-alert v-if="err" :title="err" type="error" class="mb-3" show-icon />

        <el-form label-position="top" @submit.prevent="onLogin">
          <el-form-item label="Username">
            <el-input v-model="form.username" autocomplete="username" />
          </el-form-item>
          <el-form-item label="Password">
            <el-input v-model="form.password" type="password" autocomplete="current-password" show-password />
          </el-form-item>

          <el-button type="primary" class="w-100" :loading="loading" @click="onLogin">
            Login
          </el-button>
        </el-form>

        <div class="text-muted mt-3" style="font-size: 12px;">
          mock: {{ String(useRuntimeConfig().public.mock) }}
        </div>
      </div>
    </div>
  </div>
</template>