import request from '@/utils/request'

export function getAuth() {
  return request({
    url: '/authorization',
    method: 'get'
  })
}

export function login(loginName, password) {
  return request({
    url: '/login',
    method: 'post',
    params: {
      loginName,
      password
    }
  })
}

export function getStoreRole() {
  return request({
    url: '/advanced/query',
    method: 'get'
  })
}

