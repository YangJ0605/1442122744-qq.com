import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Welcome from '@/components/welcome'
import Users from '@/components/users'
import Rights from '@/components/rights'
import Roles from '@/components/roles'
import Goods from '@/components/goods'
import Params from '@/components/params'
import Categories from '@/components/categories'
import Orders from '@/components/orders'
import Reports from '@/components/reports'
import AddGoods from '@/components/add-goods.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children:[
      // {path:'welcome', component:Welcome} // home/welcome
      {path:'/welcome', component:Welcome},
      {path:'/users', component:Users},
      {path:'/roles', component:Roles},
      {path:'/rights', component:Rights},
      {path:'/goods', component:Goods},
      {path: '/goods/add', component:AddGoods},
      {path:'/params', component:Params},
      {path:'/categories', component:Categories},
      {path:'/orders', component:Orders},
      {path:'/reports', component:Reports},
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  console.log(to.path)
  if(!token) return next(`/login?redirect=${to.path}`)
  next()
})

export default router