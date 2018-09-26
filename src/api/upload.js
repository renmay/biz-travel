import request from '@/utils/request'

export function getUploadParams() {
  return request({
    url: '/upload/params',
    method: 'get'
  })
}

