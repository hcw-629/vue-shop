import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'
// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入vue-table-with-tree-grid插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


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

// 全局应用这个vue-table-with-tree-grid插件
Vue.component('tree-table', TreeTable)

// 富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 全局定义一个时间过滤器,getDatafilter是过滤器的名字，getData是获取的时间
Vue.filter('getDatafilter',function(getData){
        const dt=new Date(getData)

        const y=dt.getFullYear()
        // 月份是从0开始的所以+1，padStart就是如果只有一个数字则在前面加0
        const m=(dt.getMonth()+1+'').padStart(2,'0')
        const d=(dt.getDate()+'').padStart(2,'0')

        const hh=(dt.getHours()+'').padStart(2,'0')
        const mm=(dt.getMinutes()+'').padStart(2,'0')
        const ss=(dt.getSeconds()+'').padStart(2,'0')

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
