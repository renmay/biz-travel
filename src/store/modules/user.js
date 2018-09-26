import { getStoreRole, getAuth, login } from '@/api/login'
import { getToken, removeToken, removeUsername, setToken, setUsername, removeStoreRole } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    auth: '',
    name: '',
    avatar: '',
    roles: [],
    storeRole: ''
  },

  mutations: {
    SET_TOKEN: (state, auth) => {
      state.auth = auth
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_STORE_ROLES: (state, storeRole) => {
      state.storeRole = storeRole
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const loginName = userInfo.loginName.trim()
      return new Promise((resolve, reject) => {
        login(loginName, userInfo.password).then(response => {
          const data = response.data
          commit('SET_ROLES', data.type)
          commit('SET_NAME', data.name)
          setUsername(data.name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取授权信息
    GetAuth({ commit }) {
      return new Promise((resolve, reject) => {
        getAuth().then(data => {
          commit('SET_TOKEN', data.data.authorization)
          setToken(data.data.authorization)
          console.log(data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_STORE_ROLES', '')
        removeToken()
        removeUsername()
        removeStoreRole()
        resolve()
      })
    },

    // 获取店铺权限
    GetStoreRoles({ commit, roles }) {
      return new Promise((resolve, reject) => {
        getStoreRole().then(data => {
          if (data.message === 'yes') {
            commit('SET_STORE_ROLES', 'advanced')
          } else {
            commit('SET_STORE_ROLES', 'advanced')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default user
