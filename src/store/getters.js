const getters = {
  imgUrl: state => state.app.imgUrl,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  storeRole: state => state.user.storeRole,
  addRouters: state => state.permission.addRouters
}
export default getters
