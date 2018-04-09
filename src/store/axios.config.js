import axios from 'axios'
import Notifications from 'react-notification-system-redux'

const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: "Hey, it's good to see you!",
  message: 'Now you can see how easy it is to use notifications in React!',
  position: 'tr',
  autoDismiss: 0,
  action: {
    label: 'Click me!!',
    callback: () => alert('clicked!')
  }
}

let mStore
let instance = axios.create()
if (process.env.NODE_ENV === 'development') {
  instance.defaults.baseURL = 'https://dev.workandpassion.bid/api/v1/'
  // instance.defaults.baseURL = 'https://api.workandpassion.se/api/v1/'
} else {
  instance.defaults.baseURL = 'https://api.workandpassion.se/api/v1/'
}

instance.defaults.timeout = 15000

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log(`error ${error}`)
    if (!error === 'Network Error') {
      // network error
      mStore.dispatch(
        Notifications.error({
          uid: 'network-error',
          title: 'Nätverksproblem',
          message:
            'Det är problem med nätverksuppkopplingen, säkerställ att du har internetuppkoppling och försök igen.',
          position: 'br',
          autoDismiss: 15
        })
      )
    }
    return Promise.reject(error)
  }
)

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
