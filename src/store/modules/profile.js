import { apiClient } from '../axios.config'
import _ from 'lodash'

const FETCH_PROFILE_START = 'wap/profile/FETCH_PROFILE_START'
const FETCH_PROFILE_SUCCESS = 'wap/profile/FETCH_PROFILE_SUCCESS'
const FETCH_PROFILE_FAIL = 'wap/profile/FETCH_PROFILE_FAIL'

const UPDATE_PROFILE_START = 'wap/profile/UPDATE_PROFILE_START'
const UPDATE_PROFILE_SUCCESS = 'wap/profile/UPDATE_PROFILE_SUCCESS'
const UPDATE_PROFILE_FAIL = 'wap/profile/UPDATE_PROFILE_FAIL'

const SET_PROFILE_PROGRESS_SUCCESS = 'wap/profile/SET_PROFILE_PROGRESS_SUCCESS'
const SET_PROFILE_PROGRESS = 'wap/profile/SET_PROFILE_PROGRESS'

const EMPTY_STATE = {
  fetchingProfile: false,
  profile: undefined,
  profileError: undefined,
  updatingProfile: false,
  progress: {
    progressPercent: 0,
    doneItems: [],
    onLevel: 0,
    items: {
      general: {
        name: 'Allmänt',
        id: 'general',
        done: false,
        icon: 'fa-user',
        level: 1
      },
      employments: {
        name: 'Anställningar',
        id: 'employments',
        done: false,
        icon: 'fa-briefcase',
        level: 1
      },
      educations: {
        name: 'Utbildningar',
        id: 'educations',
        done: false,
        icon: 'fa-graduation-cap',
        level: 1
      },
      skills: {
        name: 'Kompetenser',
        id: 'skills',
        done: false,
        icon: 'fa-rocket',
        level: 1
      },
      occupations: {
        name: 'Befattningar',
        id: 'occupations',
        done: false,
        icon: 'fa-tags',
        level: 2
      },
      languages: {
        name: 'Språk',
        id: 'languages',
        done: false,
        icon: 'fa-comments',
        level: 2
      },
      personalities: {
        name: 'Personlighet',
        id: 'personalities',
        done: false,
        icon: 'fa-lightbulb',
        level: 2
      },
      motivations: {
        name: 'Drivkrafter',
        id: 'motivations',
        done: false,
        icon: 'fa-bolt',
        level: 2
      },
      drivinglicenses: {
        name: 'Körkort',
        id: 'drivinglicenses',
        done: false,
        icon: 'fa-car',
        level: 3
      },
      wapfilm: {
        name: 'Wap-film',
        id: 'wapfilm',
        done: false,
        icon: 'fa-video',
        level: 3
      },
      personalitytest: {
        name: 'Personlighetstest (TQ)',
        id: 'personalitytest',
        done: false,
        icon: 'fa-chart-pie',
        level: 3
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
        fetchingProfile: true,
        profileError: undefined
      })
    case FETCH_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        fetchingProfile: false,
        profileError: undefined,
        ...action.profile
      })
    case FETCH_PROFILE_FAIL:
      return Object.assign({}, state, {
        fetchingProfile: false,
        profileError: action.error
      })
    case UPDATE_PROFILE_START:
      return Object.assign({}, state, {
        updatingProfile: true,
        profileError: undefined
      })
    case UPDATE_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        updatingProfile: false,
        profileError: undefined,
        ...action.profile
      })
    case UPDATE_PROFILE_FAIL:
      return Object.assign({}, state, {
        fetchingProfile: false,
        updatingProfile: false,
        profileError: action.error
      })

    case SET_PROFILE_PROGRESS:
      return Object.assign({}, state, {
        updatingProgress: true
      })
    case SET_PROFILE_PROGRESS_SUCCESS:
      return Object.assign({}, state, {
        updatingProgress: false,
        progress: action.progress
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

export function setProfileProgress() {
  return (dispatch, getState) => {
    dispatch({
      type: SET_PROFILE_PROGRESS
    })

    let mProgress = Object.assign({}, getState().profile.progress)
    if (mProgress !== EMPTY_STATE.progress) {
      mProgress = EMPTY_STATE.progress
    }
    mProgress.items['general'].done = generalDoneCheck(getState().profile)
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
    mProgress.items['personalities'].done =
      getState().personalities.userPersonalities &&
      getState().personalities.userPersonalities.length > 0
    mProgress.items['motivations'].done =
      getState().motivations.userMotivations &&
      getState().motivations.userMotivations.length > 0
    mProgress.items['drivinglicenses'].done =
      getState().drivinglicenses.userDrivinglicenses &&
      getState().drivinglicenses.userDrivinglicenses.length > 0
    mProgress.items['wapfilm'].done = getState().wapfilm.wapfilm.length > 0

    const doneItems = _.filter(mProgress.items, item => {
      return item.done
    })
    mProgress.doneItems = doneItems
    mProgress.progressPercent = doneItems.length / _.size(mProgress.items) * 100
    mProgress.onLevel = setLevel(mProgress.items)

    return dispatch({
      type: SET_PROFILE_PROGRESS_SUCCESS,
      progress: mProgress
    })
  }

  function generalDoneCheck(profile) {
    let isDone = true

    const required = [
      'first_name',
      'last_name',
      'title',
      'email',
      'mobile_phone_number'
    ]

    required.forEach(item => {
      if (!profile[item] && isDone) {
        isDone = false
      }
    })

    return isDone
  }

  function setLevel(items) {
    // let mItems = _.values(items)
    let unDoneItems = _.find(items, { done: false })
    return unDoneItems ? unDoneItems.level - 1 : 3
  }
}
