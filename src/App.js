import React, { Component } from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import routes from './routes'

/* global gtag */
class App extends Component {
  logPageView() {
    if (process.env.NODE_ENV !== 'development') {
      gtag('config', 'UA-100067149-3', {
        page_path: window.location.pathname + window.location.search
      })
    }
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
