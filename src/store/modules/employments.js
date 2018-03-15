import { apiClient } from '../axios.config'
import update from 'immutability-helper'
import _ from 'lodash'

const FETCH_EMPLOYMENTS_START = 'wap/employments/FETCH_EMPLOYMENTS_START'
const FETCH_EMPLOYMENTS_SUCCESS = 'wap/employments/FETCH_EMPLOYMENTS_SUCCESS'
const FETCH_EMPLOYMENTS_FAIL = 'wap/employments/FETCH_EMPLOYMENTS_FAIL'

const UPDATE_EMPLOYMENT_START = 'wap/employments/UPDATE_EMPLOYMENT_START'
const UPDATE_EMPLOYMENT_SUCCESS = 'wap/employments/UPDATE_EMPLOYMENT_SUCCESS'
const UPDATE_EMPLOYMENT_FAIL = 'wap/employments/UPDATE_EMPLOYMENT_FAIL'

const REMOVE_EMPLOYMENT_START = 'wap/employments/REMOVE_EMPLOYMENT_START'
const REMOVE_EMPLOYMENT_SUCCESS = 'wap/employments/REMOVE_EMPLOYMENT_SUCCESS'
const REMOVE_EMPLOYMENT_FAIL = 'wap/employments/REMOVE_EMPLOYMENT_FAIL'

const CREATE_EMPLOYMENT_START = 'wap/employments/CREATE_EMPLOYMENT_START'
const CREATE_EMPLOYMENT_SUCCESS = 'wap/employments/CREATE_EMPLOYMENT_SUCCESS'
const CREATE_EMPLOYMENT_FAIL = 'wap/employments/CREATE_EMPLOYMENT_FAIL'

const EMPTY_STATE = {
  fetchingEmployments: false,
  updatingEmployments: false,
  userEmployments: [],
  employmentsError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function employments(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_EMPLOYMENTS_START:
      return Object.assign({}, state, {
        fetchingEmployments: true
      })
    case FETCH_EMPLOYMENTS_SUCCESS:
      return Object.assign({}, state, {
        fetchingEmployments: false,
        userEmployments: action.userEmployments
      })
    case FETCH_EMPLOYMENTS_FAIL:
      return Object.assign({}, state, {
        fetchingEmployments: false,
        employmentsError: action.error
      })
    case UPDATE_EMPLOYMENT_START:
      return Object.assign({}, state, {
        updatingEmployments: true,
        employmentsError: undefined
      })
    case UPDATE_EMPLOYMENT_SUCCESS:
      let uIndex = _.findIndex(state.userEmployments, {
        id: action.employment.id
      })
      let newEmploymentsAfterUpdate = update(state.userEmployments, {
        [uIndex]: { $set: action.employment }
      })

      newEmploymentsAfterUpdate.sort((a, b) => {
        return a.start_date === b.start_date
          ? 0
          : a.start_date > b.start_date ? -1 : 1
      })

      return Object.assign({}, state, {
        updatingEmployments: false,
        employmentsError: undefined,
        userEmployments: newEmploymentsAfterUpdate
      })
    case UPDATE_EMPLOYMENT_FAIL:
      return Object.assign({}, state, {
        updatingEmployments: false,
        employmentsError: action.error
      })
    case REMOVE_EMPLOYMENT_START:
      return Object.assign({}, state, {
        updatingEmployments: true,
        employmentError: false
      })
    case REMOVE_EMPLOYMENT_SUCCESS:
      let rIndex = _.findIndex(state.userEmployments, {
        id: action.employment.id
      })
      let newEmploymentAfterRemove = update(state.userEmployments, {
        $splice: [[rIndex, 1]]
      })

      return Object.assign({}, state, {
        userEmployments: newEmploymentAfterRemove,
        updatingEmployments: false
      })
    case REMOVE_EMPLOYMENT_FAIL:
      return Object.assign({}, state, {
        updatingEmployments: false,
        employmentsError: action.error
      })
    case CREATE_EMPLOYMENT_START:
      return Object.assign({}, state, {
        updatingEmployments: true,
        employmentError: false
      })
    case CREATE_EMPLOYMENT_SUCCESS:
      let newEmploymentsAfterCreate = update(state.userEmployments, {
        $push: [action.employment]
      })
      newEmploymentsAfterCreate.sort((a, b) => {
        return a.start_date === b.start_date
          ? 0
          : a.start_date > b.start_date ? -1 : 1
      })
      return Object.assign({}, state, {
        userEmployments: newEmploymentsAfterCreate,
        updatingEmployments: false,
        employmentsError: undefined
      })
    case CREATE_EMPLOYMENT_FAIL:
      return Object.assign({}, state, {
        updatingEmployments: false,
        employmentsError: action.error
      })
    default:
      return state
  }
}

export function fetchEmployments() {
  return dispatch => {
    dispatch({ type: FETCH_EMPLOYMENTS_START })

    return apiClient
      .get('me/employments/')
      .then(result => {
        return dispatch({
          type: FETCH_EMPLOYMENTS_SUCCESS,
          userEmployments: result.data.reverse()
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_EMPLOYMENTS_FAIL,
          error: error.response.data
        })
      })
  }
}

export function updateEmployment(employment) {
  return dispatch => {
    dispatch({
      type: UPDATE_EMPLOYMENT_START
    })

    return apiClient
      .put('me/employments/' + employment.id, employment)
      .then(result => {
        return dispatch({
          type: UPDATE_EMPLOYMENT_SUCCESS,
          employment: result.data
        })
      })
      .catch(error => {
        return dispatch({
          type: UPDATE_EMPLOYMENT_FAIL,
          error: error.response.data
        })
      })
  }
}

export function removeEmployment(employment) {
  return dispatch => {
    dispatch({
      type: REMOVE_EMPLOYMENT_START
    })

    return apiClient
      .delete('me/employments/' + employment.id)
      .then(result => {
        return dispatch({
          type: REMOVE_EMPLOYMENT_SUCCESS,
          employment: employment
        })
      })
      .catch(error => {
        return dispatch({
          type: REMOVE_EMPLOYMENT_FAIL,
          error: error.response.data
        })
      })
  }
}

export function createEmployment(employment) {
  return dispatch => {
    dispatch({
      type: CREATE_EMPLOYMENT_START
    })

    return apiClient
      .post('me/employments/', employment)
      .then(result => {
        return dispatch({
          type: CREATE_EMPLOYMENT_SUCCESS,
          employment: result.data
        })
      })
      .catch(error => {
        return dispatch({
          type: CREATE_EMPLOYMENT_FAIL,
          error: error.response.data
        })
      })
  }
}
