import { apiClient } from '../axios.config'
import _ from 'lodash'

const FETCH_PROFILE_START = 'wap/profile/FETCH_PROFILE_START'
const FETCH_PROFILE_SUCCESS = 'wap/profile/FETCH_PROFILE_SUCCESS'
const FETCH_PROFILE_FAIL = 'wap/profile/FETCH_PROFILE_FAIL'

const UPDATE_PROFILE_START = 'wap/profile/UPDATE_PROFILE_START'
const UPDATE_PROFILE_SUCCESS = 'wap/profile/UPDATE_PROFILE_SUCCESS'
const UPDATE_PROFILE_FAIL = 'wap/profile/UPDATE_PROFILE_FAIL'

const SET_PROFILE_PROGRESS = 'wap/profile/SET_PROFILE_PROGRESS'

const EMPTY_STATE = {
  fetchingProfile: false,
  profile: undefined,
  profileError: undefined,
  updatingProfile: false,
  progress: {
    progressPercent: 0,
    doneItems: [],
    items: {
      employments: {
        name: 'Anställningar',
        id: 'employments',
        done: false,
        icon: 'fa-briefcase'
      },
      educations: {
        name: 'Utbildningar',
        id: 'educations',
        done: false,
        icon: 'fa-graduation-cap'
      },
      skills: {
        name: 'Kompetenser',
        id: 'skills',
        done: false,
        icon: 'fa-rocket'
      },
      occupations: {
        name: 'Befattningar',
        id: 'occupations',
        done: false,
        icon: 'fa-tags'
      },
      languages: {
        name: 'Språk',
        id: 'languages',
        done: false,
        icon: 'fa-comments'
      },
      drivinglicenses: {
        name: 'Körkort',
        id: 'drivinglicenses',
        done: false,
        icon: 'fa-car'
      }
    }
  }
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

    case SET_PROFILE_PROGRESS:
      return {
        ...state,
        progress: action.progress
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

export function setProfileProgress() {
  return (dispatch, getState) => {
    let mProgress = Object.assign({}, getState().profile.progress)
    if (mProgress !== EMPTY_STATE.progress) {
      mProgress = EMPTY_STATE.progress
    }

    mProgress.items['employments'].done =
      getState().employments.userEmployments &&
      getState().employments.userEmployments.length > 0
    mProgress.items['educations'].done =
      getState().educations.userEducations &&
      getState().educations.userEducations.length > 0
    mProgress.items['skills'].done =
      getState().skills.userSkills && getState().skills.userSkills.length > 0
    mProgress.items['occupations'].done =
      getState().occupations.userOccupations &&
      getState().occupations.userOccupations.length > 0
    mProgress.items['languages'].done =
      getState().languages.userLanguages &&
      getState().languages.userLanguages.length > 0
    mProgress.items['drivinglicenses'].done =
      getState().drivinglicenses.userDrivinglicenses &&
      getState().drivinglicenses.userDrivinglicenses.length > 0

    const doneItems = _.filter(mProgress.items, item => {
      return item.done
    })
    mProgress.doneItems = doneItems
    mProgress.progressPercent = doneItems.length / _.size(mProgress.items) * 100

    return dispatch({
      type: SET_PROFILE_PROGRESS,
      progress: mProgress
    })
  }
}
