import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import 'nprogress/nprogress.css' // progress bar style
// import NProgress from 'nprogress' // progress bar

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    console.log(res)
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 2 * 1000
    // })
    if (JSON.stringify(error).indexOf('401') >= 0) {
      store.dispatch('GetAuth').then(() => {

      })
    }
    if (JSON.stringify(error).indexOf('403') >= 0) {
      store.dispatch('GetAuth').then((next) => {
        this.$router.push({ name: 'login' })
      })
    }
  }
)

export default service
