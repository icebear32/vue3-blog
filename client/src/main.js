import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
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

// 设置服务端接口
axios.defaults.baseURL = "http://localhost:8080"

const app = createApp(App)
app.use(naive) // 全局安装 naive-ui
app.use(createPinia())
app.use(router)
app.mount('#app')