import { apiClient } from '../axios.config'

const FETCH_USERLANGUAGES_START = 'wap/languages/FETCH_USERLANGUAGES_START'
const FETCH_USERLANGUAGES_SUCCESS = 'wap/languages/FETCH_USERLANGUAGES_SUCCESS'
const FETCH_USERLANGUAGES_FAIL = 'wap/languages/FETCH_USERLANGUAGES_FAIL'

const EDIT_USERLANGUAGES_START = 'wap/languages/EDIT_USERLANGUAGES_START'
const EDIT_USERLANGUAGES_SUCCESS = 'wap/languages/EDIT_USERLANGUAGES_SUCCESS'
const EDIT_USERLANGUAGES_FAIL = 'wap/languages/EDIT_USERLANGUAGES_FAIL'

const FETCH_ALLLANGUAGES_START = 'wap/languages/FETCH_ALLLANGUAGES_START'
const FETCH_ALLLANGUAGES_SUCCESS = 'wap/languages/FETCH_ALLLANGUAGES_SUCCESS'
const FETCH_ALLLANGUAGES_FAIL = 'wap/languages/FETCH_ALLLANGUAGES_FAIL'

const EMPTY_STATE = {
  fetchingUserLanguages: false,
  fetchingAllLanguages: false,
  updatingUserLanguages: false,
  userLanguages: [],
  allLanguages: null,
  languagesError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function languages(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_USERLANGUAGES_START:
      return Object.assign({}, state, {
        fetchingUserLanguages: true
      })
    case FETCH_USERLANGUAGES_SUCCESS:
      return Object.assign({}, state, {
        fetchingUserLanguages: false,
        userLanguages: action.userLanguages
      })
    case FETCH_USERLANGUAGES_FAIL:
      return Object.assign({}, state, {
        fetchingUserLanguages: false,
        languagesError: action.error
      })

    case EDIT_USERLANGUAGES_START:
      return Object.assign({}, state, {
        updatingUserLanguages: true
      })
    case EDIT_USERLANGUAGES_SUCCESS:
      return Object.assign({}, state, {
        updatingUserLanguages: false,
        userLanguages: action.languages
      })
    case EDIT_USERLANGUAGES_FAIL:
      return Object.assign({}, state, {
        updatingUserLanguages: false,
        languagesError: action.error
      })

    case FETCH_ALLLANGUAGES_START:
      return Object.assign({}, state, {
        fetchingAllLanguages: true
      })
    case FETCH_ALLLANGUAGES_SUCCESS:
      return Object.assign({}, state, {
        fetchingAllLanguages: false,
        allLanguages: action.allLanguages
      })
    case FETCH_ALLLANGUAGES_FAIL:
      return Object.assign({}, state, {
        fetchingAllLanguages: false,
        languagesError: action.error,
        updatingUserLanguages: false
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchUserLanguages() {
  return dispatch => {
    dispatch({ type: FETCH_USERLANGUAGES_START })

    return apiClient
      .get('me/languages/')
      .then(result => {
        return dispatch({
          type: FETCH_USERLANGUAGES_SUCCESS,
          userLanguages: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_USERLANGUAGES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function editUserLanguages(languages) {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_USERLANGUAGES_START })

    return apiClient
      .post('me/languages/', languages)
      .then(result => {
        return dispatch({
          type: EDIT_USERLANGUAGES_SUCCESS,
          languages: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: EDIT_USERLANGUAGES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function fetchAllLanguages() {
  return dispatch => {
    dispatch({ type: FETCH_ALLLANGUAGES_START })

    return apiClient
      .get('languages/')
      .then(result => {
        return dispatch({
          type: FETCH_ALLLANGUAGES_SUCCESS,
          allLanguages: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_ALLLANGUAGES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}
