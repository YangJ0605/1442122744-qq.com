import {request} from './request'

export function getCategories(params) {
  return request({
    url: 'categories',
    method: 'get',
    params,
  })
}