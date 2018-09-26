import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

// const dashboard = resolve => require(['../views/dashboard/index'], resolve)

// 使用了vue-routerd的[Lazy Loading Routes
// (https://router.vuejs.org/en/advanced/lazy-loading.html)

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
// 所有权限通用路由表
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '旅行社商家后台', icon: 'home', noCache: true }
    }]
  },
  {
    path: 'dashboard',
    redirect: 'dashboard',
    name: '首页',
    component: () => import('@/views/dashboard/index'),
    meta: { title: '系统管理', icon: 'home' }
  },
  {
    path: '/travel',
    component: Layout,
    redirect: '/travel/index',
    name: 'travel',
    children: [
      {
        path: 'travel',
        name: 'travel',
        component: () => import('@/views/travel/index'),
        meta: { title: '普通产品', icon: 'ordinary' }
      }
    ]
  },
  {
    path: '/needs',
    component: Layout,
    redirect: '/needs/index',
    name: 'needs',
    children: [
      // {
      //   path: 'product',
      //   name: 'product',
      //   component: () => import('@/views/custom/product'),
      //   meta: { title: '定制列表', icon: 'selection' }
      // },
      {
        path: 'needs',
        name: 'needs',
        component: () => import('@/views/custom/needs'),
        meta: { title: '需求列表', icon: 'needs' }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/country',
    name: 'config',
    meta: { title: '参数配置', icon: 'custom' },
    children: [
      {
        path: 'country',
        name: 'Country',
        component: () => import('@/views/config/country'),
        meta: { title: '国家设置', icon: 'nation' }
      },
      {
        path: 'standard',
        name: 'standard',
        component: () => import('@/views/config/standard'),
        meta: { title: '服务标准', icon: 'stardard' }
      }
    ]
  },
  {
    path: '/protocol',
    component: Layout,
    redirect: '/protocol/index',
    name: 'protocol',
    meta: { title: '用户协议', icon: 'custom' },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/protocol/index'),
        meta: { title: '用户协议', icon: 'protocol' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

// 动态需要根据权限加载的路由表{暂时未使用}
export const asyncRouterMap = [
  {
    path: '/needs',
    component: Layout,
    redirect: '/needs/index',
    meta: { role: 'advanced' },
    name: '需求列表',
    children: [
      {
        path: 'needs',
        name: 'needs',
        component: () => import('@/views/custom/needs'),
        meta: { role: 'advanced' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

