// src/plugins/bootstrap.ts
import type { App } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'

// 样式
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

export function setupBootstrap(app: App) {
  app.use(createBootstrap())
}
