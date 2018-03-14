import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import configureStore from './store/createStore'
import { PersistGate } from 'redux-persist/es/integration/react'
import { AppContainer } from 'react-hot-loader'

const { persistor, store, history } = configureStore()

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContainer>
          <App history={history} />
        </AppContainer>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  )
}

registerServiceWorker()
render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}
