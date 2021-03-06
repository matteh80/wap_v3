import { routerReducer } from 'react-router-redux'
import storage from 'redux-persist/es/storage'
import { persistCombineReducers, purgeStoredState } from 'redux-persist'
import { reducer as notifications } from 'react-notification-system-redux'
import auth from './auth'
import profile, { setProfileProgress } from './profile'
import skills from './skills'
import languages from './languages'
import occupations from './occupations'
import locations from './locations'
import employments from './employments'
import educations from './educations'
import drivinglicenses from './drivinglicenses'
import motivations from './motivations'
import personalities from './personalities'
import wapfilm from './wapfilm'
import talentq from './talentq'

const appReducer = {
  routing: routerReducer,
  notifications,
  auth: auth,
  profile,
  skills,
  languages,
  occupations,
  locations,
  employments,
  educations,
  drivinglicenses,
  motivations,
  personalities,
  wapfilm,
  talentq
}

const config = {
  key: 'wap_v3',
  storage
}

const reducer = persistCombineReducers(config, appReducer)
// export default reducer
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
