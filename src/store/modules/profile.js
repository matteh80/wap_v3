import { apiClient } from '../axios.config'

const FETCH_PROFILE_START = 'wap/profile/FETCH_PROFILE_START'
const FETCH_PROFILE_SUCCESS = 'wap/profile/FETCH_PROFILE_SUCCESS'
const FETCH_PROFILE_FAIL = 'wap/profile/FETCH_PROFILE_FAIL'

const UPDATE_PROFILE_START = 'wap/profile/UPDATE_PROFILE_START'
const UPDATE_PROFILE_SUCCESS = 'wap/profile/UPDATE_PROFILE_SUCCESS'
const UPDATE_PROFILE_FAIL = 'wap/profile/UPDATE_PROFILE_FAIL'

const EMPTY_STATE = {
  fetchingProfile: false,
  profile: undefined,
  profileError: undefined,
  updatingProfile: false
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function profile(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_PROFILE_START:
      return Object.assign({}, state, {
        fetchingProfile: true
      })
    case FETCH_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        fetchingProfile: false,
        ...action.profile
      })
    case FETCH_PROFILE_FAIL:
      return Object.assign({}, state, {
        fetchingProfile: false,
        profileError: action.error
      })
    case UPDATE_PROFILE_START:
      return Object.assign({}, state, {
        updatingProfile: true
      })
    case UPDATE_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        updatingProfile: false,
        ...action.profile
      })
    case UPDATE_PROFILE_FAIL:
      return Object.assign({}, state, {
        fetchingProfile: false,
        profileError: action.error
      })

    default:
      return state
  }
}

// ACTIONS
export function fetchProfile() {
  return dispatch => {
    dispatch({ type: FETCH_PROFILE_START })

    return apiClient
      .get('me/')
      .then(result => {
        return dispatch({
          type: FETCH_PROFILE_SUCCESS,
          profile: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_PROFILE_FAIL,
          error: error.response.data
        })
      })
  }
}

export function updateProfile(profile) {
  return dispatch => {
    dispatch({ type: UPDATE_PROFILE_START })

    return apiClient
      .post('me/', profile)
      .then(result => {
        return dispatch({
          type: UPDATE_PROFILE_SUCCESS,
          profile: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: UPDATE_PROFILE_FAIL,
          error: error.response.data
        })
      })
  }
}
