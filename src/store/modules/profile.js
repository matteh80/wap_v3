import { apiClient } from '../axios.config'
import _ from 'lodash'
import moment from 'moment'

const FETCH_PROFILE_START = 'wap/profile/FETCH_PROFILE_START'
const FETCH_PROFILE_SUCCESS = 'wap/profile/FETCH_PROFILE_SUCCESS'
const FETCH_PROFILE_FAIL = 'wap/profile/FETCH_PROFILE_FAIL'

const UPDATE_PROFILE_START = 'wap/profile/UPDATE_PROFILE_START'
const UPDATE_PROFILE_SUCCESS = 'wap/profile/UPDATE_PROFILE_SUCCESS'
const UPDATE_PROFILE_FAIL = 'wap/profile/UPDATE_PROFILE_FAIL'

const UPLOAD_PICTURE_START = 'wap/profile/UPLOAD_PICTURE_START'
const UPLOAD_PICTURE_SUCCESS = 'wap/profile/UPLOAD_PICTURE_SUCCESS'
const UPLOAD_PICTURE_FAIL = 'wap/profile/UPLOAD_PICTURE_FAIL'

const SET_PROFILE_PROGRESS_SUCCESS = 'wap/profile/SET_PROFILE_PROGRESS_SUCCESS'
const SET_PROFILE_PROGRESS = 'wap/profile/SET_PROFILE_PROGRESS'

const EMPTY_STATE = {
  fetchingProfile: false,
  profile: undefined,
  profileError: undefined,
  updatingProfile: false,
  uploadingPicture: false,
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
      talentq: {
        name: 'Personlighetstest (TQ)',
        id: 'talentq',
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
    case UPLOAD_PICTURE_START:
      return Object.assign({}, state, {
        uploadingPicture: true,
        profilepicture: undefined,
        profileError: undefined
      })
    case UPLOAD_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        uploadingPicture: false,
        profilepicture: action.profilepicture,
        profileError: undefined
      })
    case UPLOAD_PICTURE_FAIL:
      return Object.assign({}, state, {
        uploadingPicture: false,
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
        const profileData = result.data

        Object.keys(profileData).forEach(k => {
          profileData[k] === null ? (profileData[k] = '') : profileData[k]
        })

        let hasPic = true
        let request = new XMLHttpRequest()
        let picurl = apiClient.baseURL
          ? apiClient.baseURL + 'profiles/' + result.data.id + '/picture/500'
          : 'https://api.wapcard.se/api/v1/' +
            'profiles/' +
            result.data.id +
            '/picture/500?' +
            moment().milliseconds()

        request.open('GET', picurl, true)
        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            if (request.status === 404) {
              hasPic = false
            }

            return dispatch({
              type: FETCH_PROFILE_SUCCESS,
              profile: Object.assign({}, profileData, {
                profilepicture: hasPic ? picurl : undefined
              })
            })
          }
        }
        request.send()
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_PROFILE_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function updateProfile(profile) {
  return dispatch => {
    dispatch({ type: UPDATE_PROFILE_START })

    const notNull = [
      'phone_number',
      'mobile_phone_number',
      'first_name',
      'last_name'
    ]

    !profile['phone_number'] && !profile['mobile_phone_number']
      ? (profile['mobile_phone_number'] = '00')
      : null

    !profile['first_name']
      ? (profile['first_name'] = 'Null')
      : profile['first_name']
    !profile['last_name']
      ? (profile['last_name'] = 'Null')
      : profile['last_name']

    Object.keys(profile).forEach(k => {
      profile[k] === '' && !notNull.includes(k)
        ? (profile[k] = null)
        : profile[k]
    })

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
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function uploadProfilePic(data) {
  return (dispatch, getState) => {
    dispatch({ type: UPLOAD_PICTURE_START })

    return apiClient
      .post('me/picture/', data)
      .then(result => {
        let picurl = apiClient.baseURL
          ? apiClient.baseURL +
            'profiles/' +
            getState().profile.id +
            '/picture/500?' +
            moment().milliseconds()
          : 'https://api.wapcard.se/api/v1/' +
            'profiles/' +
            getState().profile.id +
            '/picture/500?' +
            moment().milliseconds()

        return dispatch({
          type: UPLOAD_PICTURE_SUCCESS,
          profilepicture: picurl
        })
      })
      .catch(function(error) {
        return dispatch({
          type: UPLOAD_PICTURE_FAIL,
          error: error.response && error.response.data && error.response.data
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
    mProgress.items['talentq'].done = getState().talentq.test.completed

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
      'mobile_phone_number',
      'address',
      'zip_code',
      'city'
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
