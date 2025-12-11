import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { setupElementPlus } from './plugins/element'
import { setupBootstrap } from './plugins/bootstrap'
import { setupFontAwesome } from './plugins/fontawesome'
import { i18n } from './plugins/i18n'
import './styles/global.css'

const app = createApp(App) 

// 状态管理
const pinia = createPinia()
app.use(pinia)

// UI 插件
setupElementPlus(app)
setupBootstrap(app)
setupFontAwesome(app)

// 路由 & 国际化
app.use(router)
app.use(i18n)

app.mount('#app')
