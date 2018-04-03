import { apiClient } from '../axios.config'
import _ from 'lodash'
import update from 'immutability-helper'

const FETCH_USERMOTIVATIONS_START =
  'wap/motivations/FETCH_USERMOTIVATIONS_START'
const FETCH_USERMOTIVATIONS_SUCCESS =
  'wap/motivations/FETCH_USERMOTIVATIONS_SUCCESS'
const FETCH_USERMOTIVATIONS_FAIL = 'wap/motivations/FETCH_USERMOTIVATIONS_FAIL'

const EDIT_USERMOTIVATIONS_START = 'wap/motivations/EDIT_USERMOTIVATIONS_START'
const EDIT_USERMOTIVATIONS_SUCCESS =
  'wap/motivations/EDIT_USERMOTIVATIONS_SUCCESS'
const EDIT_USERMOTIVATIONS_FAIL = 'wap/motivations/EDIT_USERMOTIVATIONS_FAIL'

const FETCH_ALLMOTIVATIONS_START = 'wap/motivations/FETCH_ALLMOTIVATIONS_START'
const FETCH_ALLMOTIVATIONS_SUCCESS =
  'wap/motivations/FETCH_ALLMOTIVATIONS_SUCCESS'
const FETCH_ALLMOTIVATIONS_FAIL = 'wap/motivations/FETCH_ALLMOTIVATIONS_FAIL'

const EMPTY_STATE = {
  fetchingUserMotivations: false,
  fetchingAllMotivations: false,
  updatingUserMotivations: false,
  userMotivations: [],
  allMotivations: null,
  motivationsError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function motivations(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_USERMOTIVATIONS_START:
      return Object.assign({}, state, {
        fetchingUserMotivations: true
      })
    case FETCH_USERMOTIVATIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchingUserMotivations: false,
        userMotivations: action.userMotivations
      })
    case FETCH_USERMOTIVATIONS_FAIL:
      return Object.assign({}, state, {
        fetchingUserMotivations: false,
        motivationsError: action.error
      })

    case EDIT_USERMOTIVATIONS_START:
      return Object.assign({}, state, {
        updatingUserMotivations: true
      })
    case EDIT_USERMOTIVATIONS_SUCCESS:
      return Object.assign({}, state, {
        updatingUserMotivations: false,
        userMotivations: action.userMotivations,
        allMotivations: action.allMotivations
      })
    case EDIT_USERMOTIVATIONS_FAIL:
      return Object.assign({}, state, {
        updatingUserMotivations: false,
        motivationsError: action.error
      })

    case FETCH_ALLMOTIVATIONS_START:
      return Object.assign({}, state, {
        fetchingAllMotivations: true
      })
    case FETCH_ALLMOTIVATIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchingAllMotivations: false,
        allMotivations: action.allMotivations
      })
    case FETCH_ALLMOTIVATIONS_FAIL:
      return Object.assign({}, state, {
        fetchingAllMotivations: false,
        motivationsError: action.error,
        updatingUserMotivations: false
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchUserMotivations() {
  return dispatch => {
    dispatch({ type: FETCH_USERMOTIVATIONS_START })

    return apiClient
      .get('me/motivations/')
      .then(result => {
        return dispatch({
          type: FETCH_USERMOTIVATIONS_SUCCESS,
          userMotivations: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_USERMOTIVATIONS_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function editUserMotivations(motivation) {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_USERMOTIVATIONS_START })

    let userMotivations = getState().motivations.userMotivations
    let index = _.findIndex(userMotivations, { id: motivation.id })

    if (index > -1) {
      userMotivations = update(userMotivations, { $splice: [[index, 1]] })
    } else {
      userMotivations = update(userMotivations, { $push: [motivation] })
    }

    return apiClient
      .post('me/motivations/', userMotivations)
      .then(result => {
        let allMotivations = getState().motivations.allMotivations

        return dispatch({
          type: EDIT_USERMOTIVATIONS_SUCCESS,
          userMotivations: result.data,
          allMotivations: setupMotivations(allMotivations, result.data)
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: EDIT_USERMOTIVATIONS_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function fetchAllMotivations() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_ALLMOTIVATIONS_START })

    return apiClient
      .get('motivations/')
      .then(result => {
        let allMotivations = result.data
        let userMotivations = getState().motivations.userMotivations

        return dispatch({
          type: FETCH_ALLMOTIVATIONS_SUCCESS,
          allMotivations: setupMotivations(allMotivations, userMotivations)
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_ALLMOTIVATIONS_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

function setupMotivations(allMotivations, userMotivations) {
  // userMotivations.forEach(item => {
  //   let index = _.findIndex(allMotivations, { id: item.id })
  //   allMotivations[index].selected = true
  // })

  allMotivations.map(item => {
    let index = _.findIndex(userMotivations, { id: item.id })
    item.selected = index > -1
  })

  return allMotivations
}
