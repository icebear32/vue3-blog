import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { router } from './common/router'
import { createPinia } from 'pinia'
import axios from 'axios'
import { AdminStore } from './stores/UserStore'

axios.defaults.baseURL = "http://localhost:8080" // 设置服务端接口

// 信息 Message；通知 Notification；对话框 Dialog
const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification'])

const adminStore = AdminStore() // 实例化
// 拦截器 - 每次做请求时，都会执行，让每次的请求都带有用户的 token
axios.interceptors.request.use((config) => {
    config.headers.token = adminStore.token
    return config
})

const app = createApp(App)

// 放入全局使用
app.provide("axios", axios)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)

app.use(naive) // 全局安装 naive-ui
app.use(createPinia())
app.use(router)
app.mount('#app')