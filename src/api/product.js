import request from '@/utils/request'

const API = '/product'

// 上架
export function putOn(id) {
  return request({
    url: API + '/put/on',
    method: 'post',
    data: new URLSearchParams({ id: id })
  })
}

// 下架
export function putOff(id) {
  return request({
    url: API + '/put/off',
    method: 'post',
    data: new URLSearchParams({ id: id })
  })
}
