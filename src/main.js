import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
//字体图标
import '@/assets/fonts/iconfont.css'
//全局样式
import '@/assets/css/global.css'
//头部面包屑导航栏
import CHeader from '@/components/common/header.vue'

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.component('c-header',CHeader)

Vue.filter('dateFormat',(val) => {
  const date = new Date(val)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, 0)
  const hh = (date.getHours() + '').padStart(2, 0)
  const mm = (date.getMinutes() + '').padStart(2, 0)
  const ss = (date.getSeconds() + '').padStart(2, 0)
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
