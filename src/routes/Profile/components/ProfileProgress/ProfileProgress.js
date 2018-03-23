import React from 'react'
import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import $ from 'jquery'
import classnames from 'classnames'
import ProfilePicture from '../../../../components/ProfilePicture/ProfilePicture'

class ProfileProgress extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scrolled: false
    }
  }

  componentDidMount() {
    let _this = this
    let $window = $(window)

    $window.scroll(function() {
      if ($window.scrollTop() > 180) {
        _this.setState({
          scrolled: true
        })
      } else {
        _this.setState({
          scrolled: false
        })
      }
    })
  }

  render() {
    let { scrolled } = this.state
    const { progressPercent, profileLevel, profilepicture } = this.props

    return (
      <div
        className={classnames(
          'profile-progress--wrapper',
          scrolled ? 'scrolled' : 'notScrolled'
        )}
      >
        <div
          className={classnames(
            'progress-circle',
            'profile-level-' + profileLevel
          )}
        >
          <CircularProgressbar
            percentage={progressPercent}
            initialAnimation
            textForPercentage={null}
            strokeWidth={8}
            rotation={65}
          />
        </div>

        <GradientSVG
          startColor="#64ebe7"
          middleColor="#fbb017"
          endColor="#47a29f"
          idCSS="progressGradient"
        />
        <ProfilePicture />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profileLevel: state.profile.progress.onLevel,
  profileId: state.profile.id,
  progressPercent: state.profile.progress.progressPercent,
  profilepicture: state.profile.profilepicture
})

export default connect(mapStateToProps)(ProfileProgress)

class GradientSVG extends React.Component {
  render() {
    let { startColor, middleColor, endColor, idCSS, rotation } = this.props

    // let gradientTransform = `rotate(${parseInt(rotation)})`

    return (
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id={idCSS} gradientTransform="rotate(90)">
            <stop offset="0%" stopColor={startColor} />
            {/*<stop offset="35%" stopColor={middleColor} />*/}
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
}
