import { createApp } from 'vue'
import './style.css'
import router from "./router/index.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from 'pinia'
import App from './App.vue'
import zhCN from "element-plus/dist/locale/zh-cn.mjs" //引入中文
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
let app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(createPinia())
app.use(ElementPlus, {locale:zhCN})
app.mount("#app")
// const Base64 = require('js-base64').Base64;




