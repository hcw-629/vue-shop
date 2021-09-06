import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'
// 引入字体图标
import './assets/fonts/iconfont.css'

// 引入axios包
import axios from 'axios'
// 设置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

//axios请求拦截
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})

// 挂载到vue原型对象上:这样每一个vue组件都可以通过this.$http发起Ajax请求
Vue.prototype.$http= axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
