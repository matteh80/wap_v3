import React, { Component } from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import routes from './routes'

let Raven = require('raven-js')

Raven.config('https://9e381a0287464529af7a8a88edc27c9b@sentry.io/210938', {
  release: '0e4fdef81448dcfa0e16ecc4433ff3997aa53572'
}).install()

/* global gtag */
class App extends Component {
  componentDidMount() {
    this.props.history.listen((location, action) => {
      console.log(location)
      this.logPageView()
    })
  }

  logPageView() {
    gtag('config', 'UA-100067149-3', {
      page_path: window.location.pathname + window.location.search
    })
  }

  render() {
    return (
      <div className="App">
        <Router history={this.props.history} onUpdate={this.logPageView}>
          {routes}
        </Router>
      </div>
    )
  }
}

export default App
