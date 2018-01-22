import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import configureStore from './store/createStore'
import { PersistGate } from 'redux-persist/es/integration/react'

const { persistor, store, history } = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App history={history} />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
