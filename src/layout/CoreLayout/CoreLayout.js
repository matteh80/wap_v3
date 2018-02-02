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
        <div className="main-content h-100">
          <div className="clouds-wrapper">
            <img src={cloud_1} className="clouds" id="cloud1" />
            <img src={cloud_2} className="clouds" id="cloud2" />
            <img src={cloud_3} className="clouds" id="cloud3" />
          </div>

          {this.props.children}
        </div>
      </div>
    )
  }
}

export default CoreLayout
