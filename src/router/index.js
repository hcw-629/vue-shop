import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
Vue.use(VueRouter)

const routes = [
  // 如果路径为/,则重定向到/Login
  {
    path:'/',
   redirect:'/Login'
  },
  {
    path:'/Login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome,
      },
      {
        path:'/users',
        component:Users,
      },
      {
        path:'/rights',
        component:Rights,
      },
      {
        path:'/roles',
        component:Roles,
      },
      {
        path:'/categories',
        component:Cate,
      },
      {
        path:'/params',
        component:Params,
      },
      {
        path:'/goods',
        component:List,
      },
      {
        path:'/goods/add',
        component:Add,
      },
      {
        path:'/orders',
        component:Order,
      }
    ]
  }
]



const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
//全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach((to,from,next)=>{
  //如果用户访问登录页，直接放行
  if(to.path==='/login') return next()
  //从session Storage中获取到保存的token值
  const tokenStr=window.sessionStorage.getItem('token')
  //没有token，强制跳转到登录页
  if(!tokenStr) return next('/login')
  next()
})

export default router
