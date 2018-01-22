import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './modules/reducer'
import {
  persistStore,
  persistCombineReducers,
  purgeStoredState
} from 'redux-persist'
import storage from 'redux-persist/es/storage'
// import setListener from './axios.config'

let store

export const history = createHistory()

const config = {
  key: 'wap_v3',
  storage
}

const reducer = persistCombineReducers(config, rootReducer)
// purgeStoredState(config)

// function savePreloadedState({ getState }) {
//   return next => action => {
//     const returnValue = next(action)
//     // just point the __PRELOADED_STATE__ at the state after this action.
//     window.__PRELOADED_STATE__ = getState()
//
//     // we're not modifying the state, just spying on it.
//     return returnValue
//   }
// }

export default function configureStore() {
  const enhancers = []
  const middleware = [thunk, routerMiddleware(history)]

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )

  store = createStore(reducer, composedEnhancers)
  // setListener(store)
  let persistor = persistStore(store)

  return { persistor, store, history }
}
