import {request} from './request'

export function getUsers(options) {
 return request({
   url:'users',
   method: 'get',
   params:options.params
 })
}

export function changeUserState(options) {
  return request({
    url: `users/${options.id}/state/${options.mg_state}`,
    method: 'put'
  })
}

export function addUser(userInfo) {
  return request({
    url:'users',
    method: 'post',
    data: userInfo
  })
}

export function getUserById(id) {
  return request({
    url: `users/${id}`,
    method: 'get'
  })
}

export function editUser(id, userInfo) {
  return request({
    url: `users/${id}`,
    method: 'put',
    data: userInfo
  })
}

export function deleteUserById(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}

export function setUserRoleById(id, rid) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}

export function getRoles() {
  return request({
    url: `roles`,
    method: 'get'
  })
}