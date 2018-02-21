import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import {
  connectedRouterRedirect,
  connectedReduxRedirect
} from 'redux-auth-wrapper/history4/redirect'
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'

const locationHelper = locationHelperBuilder({})

const userIsAuthenticatedDefaults = {
  authenticatedSelector: state => state.auth.token !== '',
  authenticatingSelector: state => state.auth.loggingIn,
  wrapperDisplayName: 'UserIsAuthenticated'
}

export const userIsAuthenticated = connectedAuthWrapper(
  userIsAuthenticatedDefaults
)

export const userIsAuthenticatedRedir = connectedRouterRedirect({
  ...userIsAuthenticatedDefaults,
  redirectPath: '/login'
})

export const userIsAdminRedir = connectedRouterRedirect({
  redirectPath: '/',
  allowRedirectBack: false,
  authenticatedSelector: state =>
    state.user.data !== null && state.user.data.isAdmin,
  predicate: user => user.isAdmin,
  wrapperDisplayName: 'UserIsAdmin'
})

const userIsNotAuthenticatedDefaults = {
  // Want to redirect the user when they are done loading and authenticated
  authenticatedSelector: state => state.auth.token === '',
  wrapperDisplayName: 'UserIsNotAuthenticated'
}

export const userIsNotAuthenticated = connectedAuthWrapper(
  userIsNotAuthenticatedDefaults
)

export const userIsNotAuthenticatedRedir = connectedRouterRedirect({
  ...userIsNotAuthenticatedDefaults,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/profile',
  allowRedirectBack: false
})
