import Cookies from 'js-cookie'

// 存在cookie
const TokenKey = 'Admin-Token'
const LoginName = 'Login-Name'
const CurrentAccount = 'Current-Account'
const StoreRole = 'Store-Role'

export function getCookieAccount() {
  return Cookies.get(CurrentAccount)
}

// // 将cookie存起来 在需要的地方去设置
// export function setCookieAccount(account) {
//   return Cookies.set(CurrentAccount, account)
// }

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getStoreRole() {
  return Cookies.get(StoreRole)
}

export function setStoreRole(role) {
  return Cookies.set(StoreRole, role)
}

export function removeStoreRole() {
  return Cookies.set(StoreRole)
}

export function getUsername() {
  return Cookies.get(LoginName)
}

export function setUsername(name) {
  return Cookies.set(LoginName, name)
}

export function removeUsername() {
  return Cookies.remove(LoginName)
}
