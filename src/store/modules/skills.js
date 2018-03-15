import { apiClient } from '../axios.config'

const FETCH_USERSKILLS_START = 'wap/skills/FETCH_USERSKILLS_START'
const FETCH_USERSKILLS_SUCCESS = 'wap/skills/FETCH_USERSKILLS_SUCCESS'
const FETCH_USERSKILLS_FAIL = 'wap/skills/FETCH_USERSKILLS_FAIL'

const EDIT_USERSKILLS_START = 'wap/skills/EDIT_USERSKILLS_START'
const EDIT_USERSKILLS_SUCCESS = 'wap/skills/EDIT_USERSKILLS_SUCCESS'
const EDIT_USERSKILLS_FAIL = 'wap/skills/EDIT_USERSKILLS_FAIL'

const FETCH_ALLSKILLS_START = 'wap/skills/FETCH_ALLSKILLS_START'
const FETCH_ALLSKILLS_SUCCESS = 'wap/skills/FETCH_ALLSKILLS_SUCCESS'
const FETCH_ALLSKILLS_FAIL = 'wap/skills/FETCH_ALLSKILLS_FAIL'

const EMPTY_STATE = {
  fetchingUserSkills: false,
  fetchingAllSkills: false,
  updatingUserSkills: false,
  userSkills: [],
  allSkills: null,
  skillsError: null
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function skills(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case FETCH_USERSKILLS_START:
      return Object.assign({}, state, {
        fetchingUserSkills: true
      })
    case FETCH_USERSKILLS_SUCCESS:
      return Object.assign({}, state, {
        fetchingUserSkills: false,
        userSkills: action.userSkills
      })
    case FETCH_USERSKILLS_FAIL:
      return Object.assign({}, state, {
        fetchingUserSkills: false,
        skillsError: action.error
      })

    case EDIT_USERSKILLS_START:
      return Object.assign({}, state, {
        updatingUserSkills: true
      })
    case EDIT_USERSKILLS_SUCCESS:
      return Object.assign({}, state, {
        updatingUserSkills: false,
        userSkills: action.skills
      })
    case EDIT_USERSKILLS_FAIL:
      return Object.assign({}, state, {
        skillsError: action.error
      })

    case FETCH_ALLSKILLS_START:
      return Object.assign({}, state, {
        fetchingAllSkills: true
      })
    case FETCH_ALLSKILLS_SUCCESS:
      return Object.assign({}, state, {
        fetchingAllSkills: false,
        allSkills: action.allSkills
      })
    case FETCH_ALLSKILLS_FAIL:
      return Object.assign({}, state, {
        fetchingAllSkills: false,
        skillsError: action.error,
        updatingUserSkills: false
      })
    default:
      return state
  }
}

// ACTIONS
export function fetchUserSkills() {
  return dispatch => {
    dispatch({ type: FETCH_USERSKILLS_START })

    return apiClient
      .get('me/skills/')
      .then(result => {
        return dispatch({
          type: FETCH_USERSKILLS_SUCCESS,
          userSkills: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_USERSKILLS_FAIL,
          error: error.response.data
        })
      })
  }
}

export function editUserSkills(skills) {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_USERSKILLS_START })

    return apiClient
      .post('me/skills/', skills)
      .then(result => {
        return dispatch({
          type: EDIT_USERSKILLS_SUCCESS,
          skills: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: EDIT_USERSKILLS_FAIL,
          error: error.response.data
        })
      })
  }
}

export function fetchAllSkills() {
  return dispatch => {
    dispatch({ type: FETCH_ALLSKILLS_START })

    return apiClient
      .get('skills/')
      .then(result => {
        return dispatch({
          type: FETCH_ALLSKILLS_SUCCESS,
          allSkills: result.data
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: FETCH_ALLSKILLS_FAIL,
          error: error.response.data
        })
      })
  }
}
