import {request} from './request'

export function getGoodsList(params) {
  return request({
    url: 'goods',
    method: 'get',
    params,
  })
}