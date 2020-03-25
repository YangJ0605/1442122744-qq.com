import {request} from './request'

export function getCategories() {
  return request({
    url: 'categories',
    method: 'get'
  })
}

export function getParamsList(id,sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel
    }
  })
}

export function addParam(id, params) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: params
  })
}