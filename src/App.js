import React, { Component } from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import $ from 'jquery'
import routes from './routes'
import oops from './oops.png'

let Raven = require('raven-js')

Raven.config('https://9e381a0287464529af7a8a88edc27c9b@sentry.io/210938', {
  release: '3.0.2'
}).install()

/* global gtag */
class App extends Component {
  constructor(props) {
    super(props)

    this.state = { error: null }

    if (window.location.href.indexOf('password/reset') > -1) {
      window.location = window.location.href.replace(
        /https?:\/\/[^\/]+/i,
        'https://app.wapcard.se'
      )
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    Raven.captureException(error, { extra: errorInfo })
  }

  componentDidMount() {
    this.props.history.listen((location, action) => {
      this.logPageView()
    })
  }

  logPageView() {
    gtag('config', 'UA-100067149-3', {
      page_path: window.location.pathname + window.location.search
    })
  }

  render() {
    const { error } = this.state

    if (error) {
      //render fallback UI
      return (
        <div
          className="snap d-flex flex-column justify-content-center align-items-center"
          style={{
            minHeight: '100vh',
            minWidth: '100vw',
            backgroundSize: 'cover'
          }}
          onClick={() => Raven.lastEventId() && Raven.showReportDialog()}
        >
          <img src={oops} className="img-fluid" style={{ maxWidth: '20% ' }} />
          <p>
            Vi är ledsna, men något har gått fel. Vårt utvecklingsteam har
            blivit underrättade.
          </p>
          <p>Klicka här för att skicka en felrapport.</p>
        </div>
      )
    } else {
      return (
        <div className="App">
          <Router history={this.props.history} onUpdate={this.logPageView}>
            {routes}
          </Router>
        </div>
      )
    }
  }
}

export default App
