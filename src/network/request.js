import axios from 'axios'
//顶部进度条
import NProgress from 'nprogress'
// http://server.sineava.top/api/private/v1/
const baseURL = process.env.NODE_ENV === 'production' ? 'http://47.105.143.52:8888/api/private/v1/' : 'http://127.0.0.1:8888/api/private/v1/'
export function request(config) {
 const instance = axios.create({
   baseURL,
   timeout: 5000
 })

 instance.interceptors.request.use(config => {
   config.headers.Authorization = window.sessionStorage.getItem('token') || ''
   NProgress.start()
   return config
 })

 instance.interceptors.response.use(res => {
   NProgress.done()
   return res
 })

 return instance(config)
}