// store/permission.js
import { asyncRouterMap, constantRouterMap } from '@/router'
import { getStoreRole } from '@/utils/auth'

// function hasPermission(roles, route) {
//   if (route.meta && route.meta.role) {
//     return roles.some(role => route.meta.role.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        const roles = getStoreRole()
        const accessedRouters = asyncRouterMap.filter(v => {
          if (roles === 'advanced') {
            console.log(v)
            return v
          }
          return false
          // if (hasPermission(roles, v)) {
          //   if (v.children && v.children.length > 0) {
          //     v.children = v.children.filter(child => {
          //       if (hasPermission(roles, child)) {
          //         return child
          //       }
          //       return false
          //     })
          //     return v
          //   } else {
          //     return v
          //   }
          // }
          // return false
        })
        commit('SET_ROUTERS', accessedRouters)
        // console.log(accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
