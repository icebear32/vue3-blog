import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { router } from './common/router'
import { createPinia } from 'pinia'
import axios from 'axios'

/**
 * axios：npm install axios
 * pinia：npm install pinia
 * sass：npm install sass
 * vue-router：npm install vue-router@4
 * naive-ui：npm i -D naive-ui
 * naive-ui 字体：npm i -D vfonts
 * wangeditor：npm install @wangeditor/editor-for-vue@next --save
 */

axios.defaults.baseURL = "http://localhost:8080" // 设置服务端接口

// 信息 Message；通知 Notification；对话框 Dialog
const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification'])

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