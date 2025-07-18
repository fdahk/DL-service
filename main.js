import App from './App'
import './static/icons/iconfont.css'

// uni-app 独有的“条件编译指令， 用以实现多端适配
// #ifndef VUE3
import Vue from 'vue'   // 引入 Vue 2 的核心库
import './uni.promisify.adaptor'  // 引入 uni-app 的 Promise 适配器
Vue.config.productionTip = false  // 关闭 Vue 的生产环境提示
App.mpType = 'app'      // 设置 App 为小程序类型
const app = new Vue({   
  ...App               // 展开 App 组件的所有属性
})
// #ifdef MP-WEIXIN
wx.cloud.init({
  // env: '你的云开发环境ID', // 已配置
  traceUser: true
})
// #endif
app.$mount()           
// #endif             

// #ifdef VUE3
import { createSSRApp } from 'vue'  // 引入 Vue 3 的 SSR 应用创建函数
// #ifdef MP-WEIXIN
wx.cloud.init({
  // env: '你的云开发环境ID', // 已配置
  traceUser: true
})
// #endif
export function createApp() {       
  const app = createSSRApp(App)     // 创建支持服务端渲染的 Vue 3 应用
  return {                         // 注：仅返回应用实例，uni-app 框架会自动处理挂载流程
    app
  }
}
// #endif                         