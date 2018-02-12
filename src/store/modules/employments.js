import { apiClient } from '../axios.config'

const FETCH_EMPLOYMENTS_START = 'wap/employments/FETCH_EMPLOYMENTS_START'
const FETCH_EMPLOYMENTS_SUCCESS = 'wap/employments/FETCH_EMPLOYMENTS_SUCCESS'
const FETCH_EMPLOYMENTS_FAIL = 'wap/employments/FETCH_EMPLOYMENTS_FAIL'

const EMPTY_STATE = {
  fetchingEmployments: false,
  updatingEmployments: false,
  userEmployments: null,
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
          userEmployments: result.data
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
