import { apiClient } from '../axios.config'
import update from 'immutability-helper'
import _ from 'lodash'

const FETCH_EDUCATIONS_START = 'wap/educations/FETCH_EDUCATIONS_START'
const FETCH_EDUCATIONS_SUCCESS = 'wap/educations/FETCH_EDUCATIONS_SUCCESS'
const FETCH_EDUCATIONS_FAIL = 'wap/educations/FETCH_EDUCATIONS_FAIL'

const UPDATE_EDUCATION_START = 'wap/educations/UPDATE_EDUCATION_START'
const UPDATE_EDUCATION_SUCCESS = 'wap/educations/UPDATE_EDUCATION_SUCCESS'
const UPDATE_EDUCATION_FAIL = 'wap/educations/UPDATE_EDUCATION_FAIL'

const REMOVE_EDUCATION_START = 'wap/educations/REMOVE_EDUCATION_START'
const REMOVE_EDUCATION_SUCCESS = 'wap/educations/REMOVE_EDUCATION_SUCCESS'
const REMOVE_EDUCATION_FAIL = 'wap/educations/REMOVE_EDUCATION_FAIL'

const CREATE_EDUCATION_START = 'wap/educations/CREATE_EDUCATION_START'
const CREATE_EDUCATION_SUCCESS = 'wap/educations/CREATE_EDUCATION_SUCCESS'
const CREATE_EDUCATION_FAIL = 'wap/educations/CREATE_EDUCATION_FAIL'

const EMPTY_STATE = {
  fetchingEducations: false,
  updatingEducations: false,
  userEducations: [],
  educationsError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function educations(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_EDUCATIONS_START:
      return Object.assign({}, state, {
        fetchingEducations: true
      })
    case FETCH_EDUCATIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchingEducations: false,
        userEducations: action.userEducations
      })
    case FETCH_EDUCATIONS_FAIL:
      return Object.assign({}, state, {
        fetchingEducations: false,
        educationsError: action.error
      })
    case UPDATE_EDUCATION_START:
      return Object.assign({}, state, {
        updatingEducations: true,
        educationsError: undefined
      })
    case UPDATE_EDUCATION_SUCCESS:
      let uIndex = _.findIndex(state.userEducations, {
        id: action.education.id
      })
      let newEducationsAfterUpdate = update(state.userEducations, {
        [uIndex]: { $set: action.education }
      })

      newEducationsAfterUpdate.sort((a, b) => {
        return a.start_date === b.start_date
          ? 0
          : a.start_date > b.start_date ? -1 : 1
      })

      return Object.assign({}, state, {
        updatingEducations: false,
        educationsError: undefined,
        userEducations: newEducationsAfterUpdate
      })
    case UPDATE_EDUCATION_FAIL:
      return Object.assign({}, state, {
        updatingEducations: false,
        educationsError: action.error
      })
    case REMOVE_EDUCATION_START:
      return Object.assign({}, state, {
        updatingEducations: true,
        educationError: false
      })
    case REMOVE_EDUCATION_SUCCESS:
      let rIndex = _.findIndex(state.userEducations, {
        id: action.education.id
      })
      let newEducationAfterRemove = update(state.userEducations, {
        $splice: [[rIndex, 1]]
      })

      return Object.assign({}, state, {
        userEducations: newEducationAfterRemove,
        updatingEducations: false
      })
    case REMOVE_EDUCATION_FAIL:
      return Object.assign({}, state, {
        updatingEducations: false,
        educationsError: action.error
      })
    case CREATE_EDUCATION_START:
      return Object.assign({}, state, {
        updatingEducations: true,
        educationError: false
      })
    case CREATE_EDUCATION_SUCCESS:
      let newEducationsAfterCreate = update(state.userEducations, {
        $push: [action.education]
      })
      newEducationsAfterCreate.sort((a, b) => {
        return a.start_date === b.start_date
          ? 0
          : a.start_date > b.start_date ? -1 : 1
      })
      return Object.assign({}, state, {
        userEducations: newEducationsAfterCreate,
        updatingEducations: false,
        educationsError: undefined
      })
    case CREATE_EDUCATION_FAIL:
      return Object.assign({}, state, {
        updatingEducations: false,
        educationsError: action.error
      })
    default:
      return state
  }
}

export function fetchEducations() {
  return dispatch => {
    dispatch({ type: FETCH_EDUCATIONS_START })

    return apiClient
      .get('me/educations/')
      .then(result => {
        return dispatch({
          type: FETCH_EDUCATIONS_SUCCESS,
          userEducations: result.data.reverse()
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_EDUCATIONS_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function updateEducation(education) {
  return dispatch => {
    dispatch({
      type: UPDATE_EDUCATION_START
    })

    return apiClient
      .put('me/educations/' + education.id, education)
      .then(result => {
        return dispatch({
          type: UPDATE_EDUCATION_SUCCESS,
          education: result.data
        })
      })
      .catch(error => {
        return dispatch({
          type: UPDATE_EDUCATION_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function removeEducation(education) {
  return dispatch => {
    dispatch({
      type: REMOVE_EDUCATION_START
    })

    return apiClient
      .delete('me/educations/' + education.id)
      .then(result => {
        return dispatch({
          type: REMOVE_EDUCATION_SUCCESS,
          education: education
        })
      })
      .catch(error => {
        return dispatch({
          type: REMOVE_EDUCATION_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function createEducation(education) {
  return dispatch => {
    dispatch({
      type: CREATE_EDUCATION_START
    })

    return apiClient
      .post('me/educations/', education)
      .then(result => {
        return dispatch({
          type: CREATE_EDUCATION_SUCCESS,
          education: result.data
        })
      })
      .catch(error => {
        return dispatch({
          type: CREATE_EDUCATION_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}
