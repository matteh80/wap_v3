import React from 'react'
import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import $ from 'jquery'
import classnames from 'classnames'

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
    const { profileId, progressPercent } = this.props

    return (
      <div
        className={classnames(
          'profile-progress--wrapper',
          scrolled ? 'scrolled' : 'notScrolled'
        )}
      >
        <img
          src={
            'https://api.wapcard.se/api/v1/profiles/' +
            profileId +
            '/picture/500'
          }
          className="img-fluid profile-picture"
        />
        <div className="progress-circle">
          <CircularProgressbar
            percentage={progressPercent}
            initialAnimation
            textForPercentage={null}
            strokeWidth={10}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profileId: state.profile.id,
  progressPercent: state.profile.progress.progressPercent
})

export default connect(mapStateToProps)(ProfileProgress)
