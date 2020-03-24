import {request} from './request'

export function getRolestsList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}

export function deleteRoleRightById(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

export function getRightsTree() {
  return request({
    url: 'rights/tree',
    method: 'get'
  })
}

export function setRoleRightsByRoleId(roleId, rids){
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data:{
      rids
    }
  })
} 