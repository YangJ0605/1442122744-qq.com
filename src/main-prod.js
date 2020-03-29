import Vue from 'vue'
import App from './App.vue'
import router from './router'


// import './plugins/element.js'

import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

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
Vue.use(VueQuillEditor)

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

Vue.prototype.$confirm = window.ELEMENT.MessageBox.confirm;
// Vue.prototype.$message = window.ELEMENT.Message
//自定义全局弹窗事件
Vue.prototype.messageEvent =  (message, type = 'success', duration = 1500, center = true) => {
  window.ELEMENT.Message({
    message,
    type,
    duration,
    center
  });
}
Vue.prototype.handleError = function(res) {
  this.messageEvent(res.meta.msg, 'error')
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
