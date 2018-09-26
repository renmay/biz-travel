import store from '@/store'

export function showImage(url) {
  return store.getters.imgUrl + url
}
