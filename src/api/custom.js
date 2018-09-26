import request from '@/utils/request'

const API = '/product/custom'

export function fetchList(params) {
  return request({
    url: API,
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: API + '/add',
    method: 'post',
    data: new URLSearchParams(params)
  })
}

// 定制
export function custom(params) {
  return request({
    url: API + '/add',
    method: 'post',
    data: new URLSearchParams(params)
  })
}

// 删除
export function deleteProduct(id) {
  return request({
    url: API + '/delete',
    method: 'post',
    data: new URLSearchParams({ id: id })
  })
}

// 定制
export function edit(params) {
  return request({
    url: API + '/edit',
    method: 'post',
    data: new URLSearchParams(params)
  })
}

// 通过需求单Id获取需求单数据
export function getByCustomId(params) {
  return request({
    url: API + '/get',
    method: 'get',
    params
  })
}
