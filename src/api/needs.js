import request from '@/utils/request'

const API = '/custom/order'

export function fetchList(params) {
  return request({
    url: API + '/list',
    method: 'get',
    params
  })
}

// 分配
export function distribution(params) {
  return request({
    url: API + '/distribution',
    method: 'post',
    data: new URLSearchParams(params)
  })
}

// 取消
export function cancel(id) {
  return request({
    url: API + '/cancel',
    method: 'post',
    data: new URLSearchParams({ id: id })
  })
}
