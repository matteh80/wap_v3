import { apiClient } from '../axios.config'
import _ from 'lodash'
import update from 'immutability-helper'

const FETCH_USERDRIVINGLICENSES_START =
  'wap/drivinglicenses/FETCH_USERDRIVINGLICENSES_START'
const FETCH_USERDRIVINGLICENSES_SUCCESS =
  'wap/drivinglicenses/FETCH_USERDRIVINGLICENSES_SUCCESS'
const FETCH_USERDRIVINGLICENSES_FAIL =
  'wap/drivinglicenses/FETCH_USERDRIVINGLICENSES_FAIL'

const EDIT_USERDRIVINGLICENSES_START =
  'wap/drivinglicenses/EDIT_USERDRIVINGLICENSES_START'
const EDIT_USERDRIVINGLICENSES_SUCCESS =
  'wap/drivinglicenses/EDIT_USERDRIVINGLICENSES_SUCCESS'
const EDIT_USERDRIVINGLICENSES_FAIL =
  'wap/drivinglicenses/EDIT_USERDRIVINGLICENSES_FAIL'

const FETCH_ALLDRIVINGLICENSES_START =
  'wap/drivinglicenses/FETCH_ALLDRIVINGLICENSES_START'
const FETCH_ALLDRIVINGLICENSES_SUCCESS =
  'wap/drivinglicenses/FETCH_ALLDRIVINGLICENSES_SUCCESS'
const FETCH_ALLDRIVINGLICENSES_FAIL =
  'wap/drivinglicenses/FETCH_ALLDRIVINGLICENSES_FAIL'

const EMPTY_STATE = {
  fetchingUserDrivinglicenses: false,
  fetchingAllDrivinglicenses: false,
  updatingUserDrivinglicenses: false,
  userDrivinglicenses: [],
  allDrivinglicenses: null,
  drivinglicensesError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function drivinglicenses(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_USERDRIVINGLICENSES_START:
      return Object.assign({}, state, {
        fetchingUserDrivinglicenses: true
      })
    case FETCH_USERDRIVINGLICENSES_SUCCESS:
      return Object.assign({}, state, {
        fetchingUserDrivinglicenses: false,
        userDrivinglicenses: action.userDrivinglicenses
      })
    case FETCH_USERDRIVINGLICENSES_FAIL:
      return Object.assign({}, state, {
        fetchingUserDrivinglicenses: false,
        drivinglicensesError: action.error
      })

    case EDIT_USERDRIVINGLICENSES_START:
      return Object.assign({}, state, {
        updatingUserDrivinglicenses: true
      })
    case EDIT_USERDRIVINGLICENSES_SUCCESS:
      return Object.assign({}, state, {
        updatingUserDrivinglicenses: false,
        userDrivinglicenses: action.userLicenses,
        allDrivingLicenses: action.allLicenses
      })
    case EDIT_USERDRIVINGLICENSES_FAIL:
      return Object.assign({}, state, {
        updatingUserDrivinglicenses: false,
        drivinglicensesError: action.error
      })

    case FETCH_ALLDRIVINGLICENSES_START:
      return Object.assign({}, state, {
        fetchingAllDrivinglicenses: true
      })
    case FETCH_ALLDRIVINGLICENSES_SUCCESS:
      return Object.assign({}, state, {
        fetchingAllDrivinglicenses: false,
        allDrivinglicenses: action.allDrivinglicenses
      })
    case FETCH_ALLDRIVINGLICENSES_FAIL:
      return Object.assign({}, state, {
        fetchingAllDrivinglicenses: false,
        drivinglicensesError: action.error,
        updatingUserDrivinglicenses: false
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchUserDrivinglicenses() {
  return dispatch => {
    dispatch({ type: FETCH_USERDRIVINGLICENSES_START })

    return apiClient
      .get('api/v1/me/driving-licenses/')
      .then(result => {
        return dispatch({
          type: FETCH_USERDRIVINGLICENSES_SUCCESS,
          userDrivinglicenses: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_USERDRIVINGLICENSES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function editUserDrivinglicenses(license) {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_USERDRIVINGLICENSES_START })

    let userLicenses = getState().drivinglicenses.userDrivinglicenses
    let index = _.findIndex(userLicenses, { id: license.id })

    if (index > -1) {
      userLicenses = update(userLicenses, { $splice: [[index, 1]] })
    } else {
      userLicenses = update(userLicenses, { $push: [license] })
    }

    return apiClient
      .post('api/v1/me/driving-licenses/', userLicenses)
      .then(result => {
        let allLicenses = getState().drivinglicenses.allDrivinglicenses

        return dispatch({
          type: EDIT_USERDRIVINGLICENSES_SUCCESS,
          userLicenses: result.data,
          allLicenses: setupLicenses(allLicenses, result.data)
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: EDIT_USERDRIVINGLICENSES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function fetchAllDrivinglicenses() {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_ALLDRIVINGLICENSES_START })

    return apiClient
      .get('api/v1/driving-licenses/')
      .then(result => {
        let allLicenses = result.data
        let userLicenses = getState().drivinglicenses.userDrivinglicenses

        return dispatch({
          type: FETCH_ALLDRIVINGLICENSES_SUCCESS,
          allDrivinglicenses: setupLicenses(allLicenses, userLicenses)
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_ALLDRIVINGLICENSES_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

function setupLicenses(allLicenses, userLicenses) {
  // userLicenses.forEach(item => {
  //   let index = _.findIndex(allLicenses, { id: item.id })
  //   allLicenses[index].selected = true
  // })

  allLicenses.map(item => {
    let index = _.findIndex(userLicenses, { id: item.id })
    item.selected = index > -1
  })

  return allLicenses
}
