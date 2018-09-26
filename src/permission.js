import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUsername } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  // console.log(to)
  NProgress.start() // start progress bar
  if (getToken() && getUsername()) { // determine if there has token
    // const roles = getStoreRole()
    // console.log(store.getters.addRouters)
    // store.dispatch('GenerateRoutes', {roles}).then(() => { // 生成可访问的路由表
    //   router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
    //   next() // hack方法 确保addRouters已完成 ,set the replace: true so the navigation will not leave a history record
    //   // next({...to, replace: true}) // hack方法 确保addRouters已完成 ,set the replace: true so the navigation will not leave a history record
    // })
    next()
    NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      store.dispatch('GetAuth').then(() => {
        Message.error('请重新登录')
        // next({path: '/login'})
        next('/login') // 否则全部重定向到登录页
        NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
