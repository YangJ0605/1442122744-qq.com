import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */'@/components/login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */'@/components/home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */'@/components/welcome')
const Users = () => import(/* webpackChunkName: "users" */'@/components/users')
const Rights = () => import(/* webpackChunkName: "rights_roles" */'@/components/rights')
const Roles = () => import(/* webpackChunkName: "rights_roles" */'@/components/roles')
const Goods = () => import(/* webpackChunkName: "goods_params_cate" */'@/components/goods')
const Params = () => import(/* webpackChunkName: "goods_params_cate" */'@/components/params')
const Categories = () => import(/* webpackChunkName: "goods_params_cate" */'@/components/categories')
const AddGoods = () => import(/* webpackChunkName: "goods_params_cate" */'@/components/add-goods.vue')
const Orders = () => import(/* webpackChunkName: "orders" */'@/components/orders')
const Reports = () => import(/* webpackChunkName: "report" */'@/components/reports')


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
      {path: '/goods/edit', component:AddGoods},
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