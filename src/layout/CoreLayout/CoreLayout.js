import React from 'react'
import Header from '../Header/Header'
import cloud_1 from './cloud_1.png'
import cloud_2 from './cloud_2.png'
import cloud_3 from './cloud_3.png'

class CoreLayout extends React.Component {
  render() {
    return (
      <div className="h-100">
        <Header />
        <div className="main-content h-100">{this.props.children}</div>
      </div>
    )
  }
}

export default CoreLayout
