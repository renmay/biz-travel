import request from '@/utils/request'

const API = '/product/travel'

export function fetchList(params) {
  return request({
    url: API,
    method: 'get',
    params
  })
}

// 添加普通路线产品
export function add(params) {
  return request({
    url: API + '/add',
    method: 'post',
    data: new URLSearchParams(params)
  })
}

// 编辑普通路线产品
export function edit(params) {
  return request({
    url: API + '/edit',
    method: 'post',
    data: new URLSearchParams(params)
  })
}

// 删除普通路线产品
export function deleteProduct(id) {
  return request({
    url: API + '/delete',
    method: 'post',
    data: new URLSearchParams({ id: id })
  })
}
