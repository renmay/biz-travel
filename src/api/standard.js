import request from '@/utils/request'

const API = '/custom/standard'

export function fetchList(params) {
  return request({
    url: API + '/list',
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
// 编辑
export function edit(params) {
  return request({
    url: API + '/edit',
    method: 'post',
    data: new URLSearchParams(params)
  })
}

// 删除
export function del(id) {
  return request({
    url: API + '/delete',
    method: 'post',
    data: new URLSearchParams({ id: id })
  })
}

// 排序
export function sort(id) {
  return request({
    url: API + '/sort',
    method: 'post',
    data: new URLSearchParams({ id: id })
  })
}
