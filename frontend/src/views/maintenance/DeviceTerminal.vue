<!-- src/views/maintenance/DeviceTerminal.vue -->
<template>
  <div class="maintenance-terminal">
    <!-- 标题区 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="mb-1">设备终端</h4>
        <small class="text-muted">
          通过 Web 方式连接到设备的 SSH 终端，进行运维调试。
        </small>
      </div>
      <!-- 按要求已移除“刷新设备列表”按钮 -->
    </div>

    <!-- 连接配置区 -->
    <el-card shadow="never" class="mb-3">
      <el-form
        :model="form"
        label-width="120px"
      >
        <el-form-item label="SSH 主机">
          <el-input
            v-model="form.host"
            placeholder="例如：192.168.1.10"
            style="max-width: 320px"
          />
        </el-form-item>

        <el-form-item label="SSH 端口">
          <el-input-number
            v-model="form.port"
            :min="1"
            :max="65535"
          />
        </el-form-item>

        <el-form-item label="用户名">
          <el-input
            v-model="form.username"
            placeholder="例如：root"
            style="max-width: 240px"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :disabled="!canConnect || connecting"
            @click="onConnect"
          >
            <span
              v-if="connecting"
              class="spinner-border spinner-border-sm me-1"
            />
            <font-awesome-icon
              v-else
              icon="fa-solid fa-plug"
              class="me-1"
            />
            {{ connected ? '重新连接' : '连接终端' }}
          </el-button>

          <el-button
            class="ms-2"
            :disabled="!connected"
            @click="onDisconnect"
          >
            断开
          </el-button>

          <!-- 终止连接按钮 -->
          <el-button
            class="ms-2"
            type="danger"
            :disabled="!connected && !connecting"
            @click="onTerminate"
          >
            终止连接
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
        class="mt-2"
        :closable="false"
        type="info"
        show-icon
        description="此页面通过 WebSocket 与后端 WebSSH 服务建立连接，后端负责真实 SSH 会话。"
      />
    </el-card>

    <!-- 终端显示区 -->
    <el-card shadow="never">
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <span>SSH 终端</span>
          <span class="small text-muted">
            状态：
            <span :class="connected ? 'text-success' : 'text-secondary'">
              {{ connected ? '已连接' : '未连接' }}
            </span>
          </span>
        </div>
      </template>

      <div
        ref="terminalContainer"
        class="terminal-wrapper"
      />

      <div
        v-if="!connected"
        class="terminal-overlay d-flex flex-column align-items-center justify-content-center text-muted"
      >
        <font-awesome-icon
          icon="fa-solid fa-display"
          class="mb-2"
          style="font-size: 40px;"
        />
        <div class="mb-1">尚未连接到任何设备终端</div>
        <div class="small">请填写 SSH 信息并点击“连接终端”按钮。</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  nextTick,
} from 'vue'
import { ElMessage } from 'element-plus'

import { Terminal } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import 'xterm/css/xterm.css'
import { useAuthStore } from '@/store/auth'
//import { useRoute, useRouter } from 'vue-router'

//const router = useRouter()
//const route = useRoute()

// 左侧菜单当前选中项：/maintenance → overview；/maintenance/terminal → terminal
/*
const activeMenu = computed(() => {
  if (route.path.startsWith('/maintenance/terminal')) {
    return 'terminal'
  }
  return 'overview'
})

const onSelect = (key: string) => {
  if (key === 'terminal') {
    router.push('/maintenance/terminal')
  } else {
    router.push('/maintenance')
  }
}
*/

const form = reactive({
  host: '',
  port: 22,
  username: 'root',
})

const connecting = ref(false)
const connected = ref(false)

// xterm / WebSocket 相关
const terminalContainer = ref<HTMLDivElement | null>(null)
const term = ref<Terminal | null>(null)
const fitAddon = ref<FitAddon | null>(null)
const ws = ref<WebSocket | null>(null)

// 是否允许点击连接按钮
const canConnect = computed(() => {
  return !!form.host && !!form.username && form.port > 0
})

// 初始化 xterm
const initTerminal = async () => {
  if (term.value || !terminalContainer.value) return

  term.value = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    rows: 25,
    scrollback: 1000,
  })

  fitAddon.value = new FitAddon()
  term.value.loadAddon(fitAddon.value)

  term.value.open(terminalContainer.value)

  try {
    fitAddon.value.fit()
  } catch {
    // ignore
  }

  term.value.focus()
  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  if (fitAddon.value) {
    try {
      fitAddon.value.fit()
    } catch {
      // ignore
    }
  }
}

// 建立 WebSocket + 绑定终端输入/输出
const connectWebSocket = () => {
  if (!term.value) return

  if (ws.value) {
    ws.value.close()
    ws.value = null
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const host = window.location.host

  // 构造后端 WebSSH 地址：
  // 例如：ws://gateway/ws/ssh?host=192.168.1.10&port=22&user=root
  const params = new URLSearchParams({
    host: form.host,
    port: String(form.port),
    user: form.username,
  })

  const auth = useAuthStore()
  
  // ⭐ 这里从 auth 里拿 token，拼到 query 参数里
  if (auth.token) {
    params.append('token', auth.token)
  }

  const url = `${protocol}://${host}/ws/ssh?${params.toString()}`
  ws.value = new WebSocket(url)

  ws.value.onopen = () => {
    connecting.value = false
    connected.value = true
    term.value?.write('\r\n*** SSH 终端已连接 ***\r\n')
  }

  ws.value.onmessage = (event: MessageEvent) => {
    if (!term.value) return
    if (typeof event.data === 'string') {
      term.value.write(event.data)
    } else if (event.data instanceof ArrayBuffer) {
      const text = new TextDecoder().decode(event.data)
      term.value.write(text)
    } else if (event.data instanceof Blob) {
      event.data.text().then((text) => term.value?.write(text))
    }
  }

  ws.value.onerror = (event) => {
    console.error('WebSocket error:', event)
    ElMessage.error('SSH 连接异常')
  }

  ws.value.onclose = () => {
    connected.value = false
    if (term.value) {
      term.value.write('\r\n*** SSH 终端已断开 ***\r\n')
    }
  }

  term.value.onData((data) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(data)
    }
  })
}

// 连接终端
const onConnect = async () => {
  if (!canConnect.value) {
    ElMessage.warning('请先填写 SSH 信息')
    return
  }

  connecting.value = true

  await nextTick()
  await initTerminal()

  // 每次重新连接前，清理屏幕
  term.value?.reset()
  term.value?.write('*** 正在连接 SSH 终端 ***\r\n')

  connectWebSocket()
}

// 断开连接（正常关闭）
const onDisconnect = () => {
  if (ws.value) {
    ws.value.close()
    ws.value = null
  }
  connected.value = false
}

// 终止连接（强制关闭并清空终端）
const onTerminate = () => {
  if (ws.value) {
    try {
      ws.value.close()
    } catch {
      // ignore
    }
    ws.value = null
  }
  connecting.value = false
  connected.value = false
  term.value?.reset()
  term.value?.write('*** 连接已终止 ***\r\n')
}

onMounted(() => {
  // ⭐ SSH 主机默认用当前浏览器访问的 hostname
  if (typeof window !== 'undefined' && !form.host) {
    const loc = window.location
    form.host = loc.hostname || '127.0.0.1'
  }

  nextTick(() => {
    initTerminal()
  })
})

onBeforeUnmount(() => {
  // 移除窗口事件监听（加保护）
  try {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
  } catch {
    // ignore
  }

  // 安全关闭 WebSocket
  if (ws.value) {
    try {
      ws.value.close()
    } catch {
      // ignore
    } finally {
      ws.value = null
    }
  }

  // 安全销毁终端
  if (term.value) {
    try {
      term.value.dispose()
    } catch (e: any) {
      const msg = e?.message || ''
      // ⭐ 对于 "Could not dispose an addon that has not been loaded" 这种 xterm 特定报错直接忽略
      if (!msg.includes('Could not dispose an addon that has not been loaded')) {
        console.warn('xterm dispose error:', e)
      }
    } finally {
      term.value = null
      fitAddon.value = null
    }
  }
})
</script>

<style scoped>
.maintenance-terminal {
  width: 100%;
}

.terminal-wrapper {
  position: relative;
  width: 100%;
  height: 480px;
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
}

.terminal-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>