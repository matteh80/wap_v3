import axios from 'axios'

let instance = axios.create()
if (process.env.NODE_ENV === 'development') {
  instance.defaults.baseURL = 'https://assignments.workandpassion.bid/api/v1/'
  // instance.defaults.baseURL = 'https://api.workandpassion.se/api/v1/'
} else {
  instance.defaults.baseURL = 'https://api.workandpassion.se/api/v1/'
}

instance.defaults.timeout = 60000

// const store = getStore()
// store.subscribe(listener)
//
// function listener () {
//   let token = store.getState().auth.token
//   instance.defaults.headers = {
//     'Authorization': 'Token ' + token
//   }
// }

instance.interceptors.request.use(config => {
  if (config.url[config.url.length - 1] !== '/' && !config.noSlash) {
    config.url += '/'
  }
  return config
})

export const apiClient = instance

export default function setListener(store) {
  if (store) {
    store.subscribe(listener)

    function listener() {
      let token = store.getState().auth.token
      if (token) {
        instance.defaults.headers = {
          Authorization: 'Token ' + token,
          'Content-Type': 'application/json'
        }
      }
    }
  }
}
