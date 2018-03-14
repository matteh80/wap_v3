import axios from 'axios'
import { apiClient } from '../axios.config'
import { fetchProfile } from './profile'

const LOGIN_START = 'wap/auth/LOGIN_START'
const LOGIN_SUCCESS = 'wap/auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'wap/auth/LOGIN_FAIL'
const LOGOUT = 'wap/auth/LOGOUT'

const REGISTER_START = 'wap/auth/REGISTER_START'
const REGISTER_SUCCESS = 'wap/auth/REGISTER_SUCCESS'
const REGISTER_FAIL = 'wap/auth/REGISTER_FAIL'

const EMPTY_STATE = {
  loggingIn: false,
  registering: false,
  token: null,
  loginError: undefined,
  registerError: undefined
}
const INITIAL_STATE = window.__PRELOADED_STATE__ || EMPTY_STATE

export default function auth(state = INITIAL_STATE, action = {}) {
  // REDUCER
  switch (action.type) {
    case LOGIN_START:
      return Object.assign({}, state, {
        logginIn: true
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        logginIn: false,
        token: action.token
      })
    case LOGIN_FAIL:
      return Object.assign({}, state, {
        logginIn: false,
        loginError: action.error
      })
    case LOGOUT:
      return Object.assign({}, state, {
        token: null
      })
    case REGISTER_START:
      return Object.assign({}, state, {
        registering: true
      })
    case REGISTER_SUCCESS:
      return Object.assign({}, state, {
        registering: false,
        token: action.token
      })
    case REGISTER_FAIL:
      return Object.assign({}, state, {
        registering: false,
        registerError: action.error
      })
    default:
      return state
  }
}

// ACTIONS
export function login(email, password) {
  return dispatch => {
    dispatch({ type: LOGIN_START })

    return axios
      .post('https://api.wapcard.se/api/v1/token/', {
        username: email,
        password: password
      })
      .then(result => {
        apiClient.defaults.headers = {
          Authorization: 'Token ' + result.data.token
        }

        return dispatch(fetchProfile()).then(() => {
          return dispatch({
            type: LOGIN_SUCCESS,
            token: result.data.token
          })
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: LOGIN_FAIL,
          error: error.response.data
        })
      })
  }
}

export function socialLogin(data) {
  return dispatch => {
    dispatch({ type: LOGIN_START })

    return apiClient
      .post('login/social/token/', data)
      .catch(function(error) {
        console.log(error)
        return dispatch({
          type: LOGIN_FAIL,
          error: error.response.data
        })
      })
      .then(result => {
        apiClient.defaults.headers = {
          Authorization: 'Token ' + result.data.token
        }
        return dispatch({
          type: LOGIN_SUCCESS,
          token: result.data.token
        })
      })
  }
}

export function logout() {
  return dispatch => {
    return dispatch({
      type: LOGOUT
    })
  }
}

export function register(email, password) {
  return dispatch => {
    dispatch({ type: REGISTER_START })

    return apiClient
      .post('register/', {
        email: email,
        password: password
      })
      .then(result => {
        apiClient.defaults.headers = {
          Authorization: 'Token ' + result.data.token
        }

        return dispatch({
          type: REGISTER_SUCCESS,
          token: result.data.token
        })
      })
      .catch(error => {
        console.log(error)
        return dispatch({
          type: REGISTER_FAIL,
          error: error.response.data
        })
      })
  }
}
