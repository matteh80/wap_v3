import { apiClient } from '../axios.config'
import _ from 'lodash'
import update from 'immutability-helper'

const FETCH_USERPERSONALITIES_START =
  'wap/personalities/FETCH_USERPERSONALITIES_START'
const FETCH_USERPERSONALITIES_SUCCESS =
  'wap/personalities/FETCH_USERPERSONALITIES_SUCCESS'
const FETCH_USERPERSONALITIES_FAIL =
  'wap/personalities/FETCH_USERPERSONALITIES_FAIL'

const EDIT_USERPERSONALITIES_START =
  'wap/personalities/EDIT_USERPERSONALITIES_START'
const EDIT_USERPERSONALITIES_SUCCESS =
  'wap/personalities/EDIT_USERPERSONALITIES_SUCCESS'
const EDIT_USERPERSONALITIES_FAIL =
  'wap/personalities/EDIT_USERPERSONALITIES_FAIL'

const FETCH_ALLPERSONALITIES_START =
  'wap/personalities/FETCH_ALLPERSONALITIES_START'
const FETCH_ALLPERSONALITIES_SUCCESS =
  'wap/personalities/FETCH_ALLPERSONALITIES_SUCCESS'
const FETCH_ALLPERSONALITIES_FAIL =
  'wap/personalities/FETCH_ALLPERSONALITIES_FAIL'

const EMPTY_STATE = {
  fetchingUserPersonalities: false,
  fetchingAllPersonalities: false,
  updatingUserPersonalities: false,
  userPersonalities: [],
  allPersonalities: null,
  personalitiesError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function personalities(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_USERPERSONALITIES_START:
      return Object.assign({}, state, {
        fetchingUserPersonalities: true
      })
    case FETCH_USERPERSONALITIES_SUCCESS:
      return Object.assign({}, state, {
        fetchingUserPersonalities: false,
        userPersonalities: action.userPersonalities
      })
    case FETCH_USERPERSONALITIES_FAIL:
      return Object.assign({}, state, {
        fetchingUserPersonalities: false,
        personalitiesError: action.error
      })

    case EDIT_USERPERSONALITIES_START:
      return Object.assign({}, state, {
        updatingUserPersonalities: true
      })
    case EDIT_USERPERSONALITIES_SUCCESS:
      return Object.assign({}, state, {
        updatingUserPersonalities: false,
        userPersonalities: action.userPersonalities,
        allPersonalities: action.allPersonalities
      })
    case EDIT_USERPERSONALITIES_FAIL:
      return Object.assign({}, state, {
        updatingUserPersonalities: false,
        personalitiesError: action.error
      })

    case FETCH_ALLPERSONALITIES_START:
      return Object.assign({}, state, {
        fetchingAllPersonalities: true
      })
    case FETCH_ALLPERSONALITIES_SUCCESS:
      return Object.assign({}, state, {
        fetchingAllPersonalities: false,
        allPersonalities: action.allPersonalities
      })
    case FETCH_ALLPERSONALITIES_FAIL:
      return Object.assign({}, state, {
        fetchingAllPersonalities: false,
        personalitiesError: action.error,
        updatingUserPersonalities: false
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchUserPersonalities() {
  return dispatch => {
    dispatch({ type: FETCH_USERPERSONALITIES_START })

    return apiClient
      .get('me/personalities/')
      .then(result => {
        return dispatch({
          type: FETCH_USERPERSONALITIES_SUCCESS,
          userPersonalities: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_USERPERSONALITIES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function editUserPersonalities(personality) {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_USERPERSONALITIES_START })

    let userPersonalities = getState().personalities.userPersonalities
    let index = _.findIndex(userPersonalities, { id: personality.id })

    if (index > -1) {
      userPersonalities = update(userPersonalities, { $splice: [[index, 1]] })
    } else {
      userPersonalities = update(userPersonalities, { $push: [personality] })
    }

    return apiClient
      .post('me/personalities/', userPersonalities)
      .then(result => {
        let allPersonalities = getState().personalities.allPersonalities

        return dispatch({
          type: EDIT_USERPERSONALITIES_SUCCESS,
          userPersonalities: result.data,
          allPersonalities: setupPersonalities(allPersonalities, result.data)
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: EDIT_USERPERSONALITIES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function fetchAllPersonalities() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_ALLPERSONALITIES_START })

    return apiClient
      .get('personalities/')
      .then(result => {
        let allPersonalities = result.data
        let userPersonalities = getState().personalities.userPersonalities

        return dispatch({
          type: FETCH_ALLPERSONALITIES_SUCCESS,
          allPersonalities: setupPersonalities(
            allPersonalities,
            userPersonalities
          )
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_ALLPERSONALITIES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

function setupPersonalities(allPersonalities, userPersonalities) {
  // userPersonalities.forEach(item => {
  //   let index = _.findIndex(allPersonalities, { id: item.id })
  //   allPersonalities[index].selected = true
  // })

  allPersonalities.map(item => {
    let index = _.findIndex(userPersonalities, { id: item.id })
    item.selected = index > -1
  })

  return allPersonalities
}
