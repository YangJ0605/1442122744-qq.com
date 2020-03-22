import axios from 'axios'

export function request(config) {
 const instance = axios.create({
   baseURL: 'http://127.0.0.1:8888/api/private/v1/',
   timeout: 5000
 })

 instance.interceptors.request.use(config => {
   return config
 })

 instance.interceptors.response.use(res => {
   return res
 })

 return instance(config)
}