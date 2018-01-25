import { apiClient } from '../axios.config'

const FETCH_USEROCCUPATIONS_START =
  'wap/occupations/FETCH_USEROCCUPATIONS_START'
const FETCH_USEROCCUPATIONS_SUCCESS =
  'wap/occupations/FETCH_USEROCCUPATIONS_SUCCESS'
const FETCH_USEROCCUPATIONS_FAIL = 'wap/occupations/FETCH_USEROCCUPATIONS_FAIL'

const EDIT_USEROCCUPATIONS_START = 'wap/occupations/EDIT_USEROCCUPATIONS_START'
const EDIT_USEROCCUPATIONS_SUCCESS =
  'wap/occupations/EDIT_USEROCCUPATIONS_SUCCESS'
const EDIT_USEROCCUPATIONS_FAIL = 'wap/occupations/EDIT_USEROCCUPATIONS_FAIL'

const FETCH_ALLOCCUPATIONS_START = 'wap/occupations/FETCH_ALLOCCUPATIONS_START'
const FETCH_ALLOCCUPATIONS_SUCCESS =
  'wap/occupations/FETCH_ALLOCCUPATIONS_SUCCESS'
const FETCH_ALLOCCUPATIONS_FAIL = 'wap/occupations/FETCH_ALLOCCUPATIONS_FAIL'

const EMPTY_STATE = {
  fetchingUserOccupations: false,
  fetchingAllOccupations: false,
  addingUserOccupation: false,
  userOccupations: null,
  allOccupations: null,
  occupationsError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function occupations(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_USEROCCUPATIONS_START:
      return Object.assign({}, state, {
        fetchingUserOccupations: true
      })
    case FETCH_USEROCCUPATIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchingUserOccupations: false,
        userOccupations: action.userOccupations
      })
    case FETCH_USEROCCUPATIONS_FAIL:
      return Object.assign({}, state, {
        fetchingUserOccupations: false,
        occupationsError: action.error
      })

    case EDIT_USEROCCUPATIONS_START:
      return Object.assign({}, state, {
        addingUserOccupation: true
      })
    case EDIT_USEROCCUPATIONS_SUCCESS:
      return Object.assign({}, state, {
        addingUserOccupation: false,
        userOccupations: action.occupations
      })
    case EDIT_USEROCCUPATIONS_FAIL:
      return Object.assign({}, state, {
        occupationsError: action.error
      })

    case FETCH_ALLOCCUPATIONS_START:
      return Object.assign({}, state, {
        fetchingAllOccupations: true
      })
    case FETCH_ALLOCCUPATIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchingAllOccupations: false,
        allOccupations: action.allOccupations
      })
    case FETCH_ALLOCCUPATIONS_FAIL:
      return Object.assign({}, state, {
        fetchingAllOccupations: false,
        occupationsError: action.error
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchUserOccupations() {
  return dispatch => {
    dispatch({ type: FETCH_USEROCCUPATIONS_START })

    return apiClient
      .get('me/occupations/')
      .then(result => {
        return dispatch({
          type: FETCH_USEROCCUPATIONS_SUCCESS,
          userOccupations: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_USEROCCUPATIONS_FAIL,
          error: error.response.data
        })
      })
  }
}

export function editUserOccupations(occupations) {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_USEROCCUPATIONS_START })

    return apiClient
      .post('me/occupations/', occupations)
      .then(result => {
        return dispatch({
          type: EDIT_USEROCCUPATIONS_SUCCESS,
          occupations: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: EDIT_USEROCCUPATIONS_FAIL,
          error: error.response.data
        })
      })
  }
}

export function fetchAllOccupations() {
  return dispatch => {
    dispatch({ type: FETCH_ALLOCCUPATIONS_START })

    return apiClient
      .get('occupations/')
      .then(result => {
        return dispatch({
          type: FETCH_ALLOCCUPATIONS_SUCCESS,
          allOccupations: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_ALLOCCUPATIONS_FAIL,
          error: error.response.data
        })
      })
  }
}
