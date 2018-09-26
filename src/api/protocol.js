import request from '@/utils/request'

const API = '/agreement'

// 获取
export function getAgreement() {
  return request({
    url: API + '/get',
    method: 'get'
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
