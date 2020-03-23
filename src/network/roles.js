import {request} from './request'

export function getRolestsList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}