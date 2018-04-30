import axios from 'axios'
import Notifications from 'react-notification-system-redux'

let mStore
let instance = axios.create()
if (process.env.NODE_ENV === 'development') {
  // instance.defaults.baseURL = 'https://dev.workandpassion.bid/api/v1/'
  // instance.defaults.baseURL = 'https://dev-aws.workandpassion.bid/'
  instance.defaults.baseURL = 'https://api.workandpassion.se/'
  // instance.defaults.baseURL = 'https://prod-aws.workandpassion.bid/'
} else {
  // instance.defaults.baseURL = 'https://dev-aws.workandpassion.bid/'
  // instance.defaults.baseURL = 'https://api.workandpassion.se/api/v1/'
  // instance.defaults.baseURL = 'https://prod-aws.workandpassion.bid/'
  instance.defaults.baseURL = 'https://api.workandpassion.se/'
}

instance.defaults.timeout = 30000

// instance.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     console.log(`error ${error}`)
//     if (!error === 'Network Error') {
//       // network error
//       mStore.dispatch(
//         Notifications.error({
//           uid: 'network-error',
//           title: 'Nätverksproblem',
//           message:
//             'Det är problem med nätverksuppkopplingen, säkerställ att du har internetuppkoppling och försök igen.',
//           position: 'br',
//           autoDismiss: 15
//         })
//       )
//     }
//     return Promise.reject(error)
//   }
// )

export const apiClient = instance

export default function setListener(store) {
  if (store) {
    mStore = store
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
