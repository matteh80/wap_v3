import React from 'react'
import Header from '../Header/Header'
import { connect } from 'react-redux'
import classnames from 'classnames'
import $ from 'jquery'

class CoreLayout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      changeLevel: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.onLevel !== this.props.onLevel) {
      const _this = this

      this.setState({
        changeLevel: true
      })

      setTimeout(function() {
        _this.setState({
          changeLevel: false
        })
      }, 1000)
    }
  }

  render() {
    const { changeLevel } = this.state
    const { onLevel } = this.props
    return (
      <div
        className={classnames(
          'core-layout h-100',
          'level-' + onLevel,
          changeLevel && 'changeLevel'
        )}
      >
        <Header />
        <div className="main-content h-100">{this.props.children}</div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  onLevel: state.profile.progress.onLevel
})

export default connect(mapStateToProps)(CoreLayout)
