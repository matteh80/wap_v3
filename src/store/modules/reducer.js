import { routerReducer } from 'react-router-redux'
import auth from './auth'
import profile from './profile'
import skills from './skills'

const rootReducer = {
  routing: routerReducer,
  auth: auth,
  profile: profile,
  skills: skills
}

export default rootReducer
