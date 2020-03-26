import {request} from './request'

export function getGoodsList(params) {
  return request({
    url: 'goods',
    method: 'get',
    params,
  })
}

export function deleteGoodsById(id) {
  return request({
    url: 'goods/' + id,
    method: 'delete'
  })
}