import { routerReducer } from 'react-router-redux'
import storage from 'redux-persist/es/storage'
import { persistCombineReducers, purgeStoredState } from 'redux-persist'
import auth from './auth'
import profile from './profile'
import skills from './skills'
import languages from './languages'
import occupations from './occupations'
import locations from './locations'

const appReducer = {
  routing: routerReducer,
  auth: auth,
  profile,
  skills,
  languages,
  occupations,
  locations
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
