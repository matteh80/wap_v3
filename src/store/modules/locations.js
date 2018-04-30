import { apiClient } from '../axios.config'

const FETCH_USERLOCATIONS_START = 'wap/locations/FETCH_USERLOCATIONS_START'
const FETCH_USERLOCATIONS_SUCCESS = 'wap/locations/FETCH_USERLOCATIONS_SUCCESS'
const FETCH_USERLOCATIONS_FAIL = 'wap/locations/FETCH_USERLOCATIONS_FAIL'

const EDIT_USERLOCATIONS_START = 'wap/locations/EDIT_USERLOCATIONS_START'
const EDIT_USERLOCATIONS_SUCCESS = 'wap/locations/EDIT_USERLOCATIONS_SUCCESS'
const EDIT_USERLOCATIONS_FAIL = 'wap/locations/EDIT_USERLOCATIONS_FAIL'

const FETCH_ALLLOCATIONS_START = 'wap/locations/FETCH_ALLLOCATIONS_START'
const FETCH_ALLLOCATIONS_SUCCESS = 'wap/locations/FETCH_ALLLOCATIONS_SUCCESS'
const FETCH_ALLLOCATIONS_FAIL = 'wap/locations/FETCH_ALLLOCATIONS_FAIL'

const EMPTY_STATE = {
  fetchingUserLocations: false,
  fetchingAllLocations: false,
  addingUserLocation: false,
  userLocations: [],
  allLocations: null,
  locationsError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function locations(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_USERLOCATIONS_START:
      return Object.assign({}, state, {
        fetchingUserLocations: true
      })
    case FETCH_USERLOCATIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchingUserLocations: false,
        userLocations: action.userLocations
      })
    case FETCH_USERLOCATIONS_FAIL:
      return Object.assign({}, state, {
        fetchingUserLocations: false,
        locationsError: action.error
      })

    case EDIT_USERLOCATIONS_START:
      return Object.assign({}, state, {
        addingUserLocation: true
      })
    case EDIT_USERLOCATIONS_SUCCESS:
      return Object.assign({}, state, {
        addingUserLocation: false,
        userLocations: action.locations
      })
    case EDIT_USERLOCATIONS_FAIL:
      return Object.assign({}, state, {
        addingUserLocation: false,
        locationsError: action.error
      })

    case FETCH_ALLLOCATIONS_START:
      return Object.assign({}, state, {
        fetchingAllLocations: true
      })
    case FETCH_ALLLOCATIONS_SUCCESS:
      return Object.assign({}, state, {
        fetchingAllLocations: false,
        allLocations: action.allLocations
      })
    case FETCH_ALLLOCATIONS_FAIL:
      return Object.assign({}, state, {
        fetchingAllLocations: false,
        locationsError: action.error
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchUserLocations() {
  return dispatch => {
    dispatch({ type: FETCH_USERLOCATIONS_START })

    return apiClient
      .get('api/v1/me/locations/')
      .then(result => {
        const sortedLocations = result.data.sort((a, b) => {
          return a.parent_name > b.parent_name
            ? 1
            : a.parent_name < b.parent_name ? -1 : 0
        })
        return dispatch({
          type: FETCH_USERLOCATIONS_SUCCESS,
          userLocations: sortedLocations
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_USERLOCATIONS_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function editUserLocations(locations) {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_USERLOCATIONS_START })

    return apiClient
      .post('api/v1/me/locations/', locations)
      .then(result => {
        return dispatch({
          type: EDIT_USERLOCATIONS_SUCCESS,
          locations: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: EDIT_USERLOCATIONS_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}

export function fetchAllLocations() {
  return dispatch => {
    dispatch({ type: FETCH_ALLLOCATIONS_START })

    return apiClient
      .get('api/v1/locations/')
      .then(result => {
        return dispatch({
          type: FETCH_ALLLOCATIONS_SUCCESS,
          allLocations: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_ALLLOCATIONS_FAIL,
          error: error.response && error.response.data && error.response.data
        })
      })
  }
}
