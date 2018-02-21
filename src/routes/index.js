import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import CoreLayout from '../layout/CoreLayout/CoreLayout'

// ROUTES
import Login from './Login/Login'
import Register from './Register/Register'
import Profile from './Profile/Profile'
import Account from './Account/Account'

import {
  userIsNotAuthenticatedRedir,
  userIsAuthenticatedRedir
} from '../store/auth'

const CoreLayoutComponent = userIsAuthenticatedRedir(CoreLayout)
const LoginComponent = userIsNotAuthenticatedRedir(Login)

const routes = (
  <Switch>
    <Route path="/login" component={LoginComponent} />
    <Route path="/register" component={userIsNotAuthenticatedRedir(Register)} />
    <RouteWithLayout
      layout={CoreLayoutComponent}
      path="/profile"
      component={Profile}
    />
    <RouteWithLayout
      layout={CoreLayoutComponent}
      path="/account"
      component={Account}
    />
    {/*<Redirect path="/" to="/profile" />*/}
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
          React.createElement(component, props)
        )
      }
    />
  )
}
