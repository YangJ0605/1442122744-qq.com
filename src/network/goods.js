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

export function getGoodsById(id) {
  return request({
    url: 'goods/' + id,
    method: 'get'
  })
}

export function addNewGoods(data) {
  return request({
    url: 'goods',
    method:'post',
    data
  })
}

export function editGoodsById(id,data) {
  return request({
    url: 'goods/' + id,
    method:'put',
    data
  })
}