import { routerReducer } from 'react-router-redux'
import auth from './auth'
import profile from './profile'
import skills from './skills'
import storage from 'redux-persist/es/storage'
import { persistCombineReducers, purgeStoredState } from 'redux-persist'

const appReducer = {
  routing: routerReducer,
  auth: auth,
  profile: profile,
  skills: skills
}

const config = {
  key: 'wap_v3',
  storage
}

const reducer = persistCombineReducers(config, appReducer)
// purgeStoredState(config)

export const rootReducer = (state, action) => {
  // purgeStoredState(config)
  if (action.type === 'wap/auth/LOGOUT') {
    // state = undefined
    purgeStoredState(config)
    state = {
      routing: state.routing
    }
  }
  return reducer(state, action)
}

export default rootReducer
