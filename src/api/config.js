import request from '@/utils/request'

export function addAccount(data) {
  return request({
    url: '/mp/account/add',
    method: 'post',
    data
  })
}
