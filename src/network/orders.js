import {request} from './request'

export function getOrdersList(params) {
  return request({
    url: 'orders',
    method: 'get',
    params
  })
}

export function getOrdersDetail(id) {
  return request({
    url: 'orders/' + id,
    method: 'get'
  })
}

export function getOrderProgress() {
  return request({
    url: 'kuaidi/804909574412544580',
    method: 'get'
  })
}