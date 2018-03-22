import { apiClient } from '../axios.config'

const FETCH_WAPFILM_START = 'wap/wapfilm/FETCH_WAPFILM_START'
const FETCH_WAPFILM_SUCCESS = 'wap/wapfilm/FETCH_WAPFILM_SUCCESS'
const FETCH_WAPFILM_FAIL = 'wap/wapfilm/FETCH_WAPFILM_FAIL'

const DELETE_WAPFILM_SUCCESS = 'wap/wapfilm/DELETE_WAPFILM_SUCCESS'
const DELETE_WAPFILM_FAIL = 'wap/wapfilm/DELETE_WAPFILM_FAIL'

const EMPTY_STATE = {
  fetchingWapfilm: false,
  wapfilmError: null,
  wapfilm: []
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function skills(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_WAPFILM_START:
      return Object.assign({}, state, {
        fetchingWapfilm: true,
        uploadingWapfilm: false
      })
    case FETCH_WAPFILM_SUCCESS:
      return Object.assign({}, state, {
        fetchingWapfilm: false,
        uploadingWapfilm: false,
        wapfilm: action.wapfilm
      })
    case FETCH_WAPFILM_FAIL:
      return Object.assign({}, state, {
        fetchingWapfilm: false,
        uploadingWapfilm: false,
        wapfilm: [],
        wapfilmError: action.error
      })
    case DELETE_WAPFILM_SUCCESS:
      return Object.assign({}, state, {
        fetchingWapfilm: false,
        uploadingWapfilm: false,
        wapfilm: []
      })
    case DELETE_WAPFILM_FAIL:
      return Object.assign({}, state, {
        fetchingWapfilm: false,
        uploadingWapfilm: false,
        wapfilmError: action.error
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchWapfilm() {
  return dispatch => {
    dispatch({
      type: FETCH_WAPFILM_START
    })

    return apiClient
      .get('me/videos/')
      .then(result => {
        dispatch({
          type: FETCH_WAPFILM_SUCCESS,
          wapfilm: result.data
        })
      })
      .catch(error => {
        return dispatch({
          type: FETCH_WAPFILM_FAIL,
          error: error.response.data
        })
      })
  }
}

export function deleteVideo(videoId) {
  return dispatch => {
    return apiClient
      .delete('me/videos/' + videoId)
      .then(() => {
        return dispatch({
          type: DELETE_WAPFILM_SUCCESS
        })
      })
      .catch(error => {
        return dispatch({
          type: DELETE_WAPFILM_FAIL,
          error: error.response.data
        })
      })
  }
}

export function setVideoInfo(data) {
  return (dispatch, getState) => {
    return dispatch({
      type: FETCH_WAPFILM_SUCCESS,
      wapfilm: [data]
    })
  }
}
