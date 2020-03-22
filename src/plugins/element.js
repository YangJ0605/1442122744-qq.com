import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
//自定义全局弹窗事件
Vue.prototype.messageEvent = function (message, type, duration, center) {
  this.$message({
    message,
    type,
    duration,
    center
  });
}