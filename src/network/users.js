import {request} from './request'

export function getUsers(options) {
 return request({
   url:'users',
   method: 'get',
   params:options.params
 })
}