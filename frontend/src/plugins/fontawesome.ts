// src/plugins/fontawesome.ts
import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { fas } from '@fortawesome/free-solid-svg-icons'
// 把整个 solid 图标包都注册进去
library.add(fas)

export function setupFontAwesome(app: App) {
  // 全局注册组件：<font-awesome-icon>
  app.component('font-awesome-icon', FontAwesomeIcon)
}
