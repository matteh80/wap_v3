import React from 'react'
import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import $ from 'jquery'
import classnames from 'classnames'
import noPicFemale from './noPicFemale.png'

class ProfileProgress extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scrolled: false,
      pictureUrl:
        'https://api.wapcard.se/api/v1/profiles/' +
        props.profileId +
        '/picture/500'
    }

    this.onError = this.onError.bind(this)
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

  onError() {
    this.setState({
      pictureUrl: noPicFemale
    })
  }

  render() {
    let { scrolled, pictureUrl } = this.state
    const { profileId, progressPercent } = this.props

    return (
      <div
        className={classnames(
          'profile-progress--wrapper',
          scrolled ? 'scrolled' : 'notScrolled'
        )}
      >
        <img
          src={pictureUrl}
          className="img-fluid profile-picture"
          onError={this.onError}
        />
        <div className="progress-circle">
          <CircularProgressbar
            percentage={100}
            initialAnimation
            textForPercentage={null}
            strokeWidth={8}
            rotation="180"
          />
        </div>

        <GradientSVG
          startColor="#fb5217"
          middleColor="#fbb017"
          endColor="#47a29f"
          idCSS="progressGradient"
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profileId: state.profile.id,
  progressPercent: state.profile.progress.progressPercent
})

export default connect(mapStateToProps)(ProfileProgress)

class GradientSVG extends React.Component {
  render() {
    let { startColor, middleColor, endColor, idCSS, rotation } = this.props

    let gradientTransform = `rotate(${rotation})`

    return (
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id={idCSS} gradientTransform={gradientTransform}>
            <stop offset="0%" stopColor={startColor} />
            {/*<stop offset="35%" stopColor={middleColor} />*/}
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
}
