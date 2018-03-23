import { apiClient } from '../axios.config'

const FETCH_TQ_START = 'wap/talentq/FETCH_TEST_START'
const FETCH_TQ_SUCCESS = 'wap/talentq/FETCH_TEST_SUCCESS'
const FETCH_TQ_FAIL = 'wap/talentq/FETCH_TEST_FAIL'

const EMPTY_STATE = {
  fetchingTest: false,
  testError: null,
  test: []
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function talentq(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case FETCH_TQ_START:
      return Object.assign({}, state, {
        fetchingTest: true
      })
    case FETCH_TQ_SUCCESS:
      return Object.assign({}, state, {
        fetchingTest: false,
        test: action.test
      })
    case FETCH_TQ_FAIL:
      return Object.assign({}, state, {
        fetchingTest: false,
        testError: action.error
      })
    default:
      return state
  }
}

// ACTIONS
export function getTestStatus() {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_TQ_START
    })

    return apiClient
      .get('me/assessment/')
      .then(result => {
        return dispatch({
          type: FETCH_TQ_SUCCESS,
          test: result.data
        })
      })
      .catch(error => {
        return dispatch({
          type: FETCH_TQ_FAIL,
          error: error.response.data
        })
      })
  }
}

export function initiateTest(lang) {
  return dispatch => {
    dispatch({
      type: FETCH_TQ_START
    })

    return apiClient
      .post('me/assessment/', null)
      .then(result => {
        return dispatch({
          type: FETCH_TQ_SUCCESS,
          test: result.data
        })
      })
      .catch(error => {
        return dispatch({
          type: FETCH_TQ_FAIL,
          error: error.response.data
        })
      })
  }
}
