import request from '@/utils/request'

// 定制师
export function customer(params) {
  return request({
    url: '/merchant/manager/list',
    method: 'get',
    params
  })
}
