import React from 'react'
import Header from '../Header/Header'

class CoreLayout extends React.Component {
  render() {
    return (
      <div className="h-100">
        <Header />
        <div className="main-content h-100 py-5">{this.props.children}</div>
      </div>
    )
  }
}

export default CoreLayout
