import { apiClient } from '../axios.config'

const FETCH_PROFILE_START = 'wap/profile/FETCH_PROFILE_START'
const FETCH_PROFILE_SUCCESS = 'wap/profile/FETCH_PROFILE_SUCCESS'
const FETCH_PROFILE_FAIL = 'wap/profile/FETCH_PROFILE_FAIL'

const EMPTY_STATE = {
  fetchingProfile: false,
  profile: undefined,
  profileError: undefined
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function profile(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_PROFILE_START:
      return {
        fetchingProfile: true
      }
    case FETCH_PROFILE_SUCCESS:
      return {
        fetchingProfile: false,
        ...action.profile
      }
    case FETCH_PROFILE_FAIL:
      return {
        fetchingProfile: false,
        profileError: action.error
      }
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
