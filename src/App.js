import React, { Component } from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import routes from './routes'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={this.props.history}>{routes}</Router>
      </div>
    )
  }
}

export default App
