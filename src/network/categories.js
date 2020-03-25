import {request} from './request'

export function getCategories(params) {
  return request({
    url: 'categories',
    method: 'get',
    params,
  })
}

export function addCategory(data) {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}

export function editCategory(id,cat_name) {
  return request({
    url: 'categories/' + id,
    method: 'put',
    data:{
      cat_name
    }
  })
}

export function deleteCategory(id) {
  return request({
    url: 'categories/' + id,
    method: 'delete'
  })
}