import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import CoreLayout from '../layout/CoreLayout/CoreLayout'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

// ROUTES
import Login from './Login/Login'
import Register from './Register/Register'
import Profile from './Profile/Profile'

const locationHelper = locationHelperBuilder({})
const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/login',
  authenticatedSelector: state =>
    state.auth.token !== null && state.profile !== null,
  wrapperDisplayName: 'UserIsAuthenticated'
})

const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/profile',
  allowRedirectBack: false,
  authenticatedSelector: state => state.auth.token === null,
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

const routes = (
  <Switch>
    <Route path="/login" component={userIsNotAuthenticated(Login)} />
    <Route path="/register" component={userIsNotAuthenticated(Register)} />
    <RouteWithLayout layout={CoreLayout} path="/profile" component={Profile} />
    <Redirect path="/" to="/profile" />
  </Switch>
)

export default routes

function RouteWithLayout({ layout, component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        React.createElement(
          layout,
          props,
          React.createElement(userIsAuthenticated(component), props)
        )
      }
    />
  )
}
