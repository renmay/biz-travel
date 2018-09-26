import request from '@/utils/request'

// 获取menu
export function fetchList(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params
  })
}

// 获取menu
export function getMsgByMsgId(msgId) {
  return request({
    url: '/menu/msg',
    method: 'get',
    params: { msgId }
  })
}

// 获取全部素材
export function messageList(params) {
  return request({
    url: '/msg/list',
    method: 'get',
    params
  })
}

export function publish() {
  return request({
    url: '/menu/publish',
    method: 'post'
  })
}

export function save(menus) {
  return request({
    url: '/menu/save',
    method: 'post',
    params: { 'menus': JSON.stringify(menus) }
  })
}
