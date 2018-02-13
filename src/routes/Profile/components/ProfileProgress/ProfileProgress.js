import React from 'react'
import { connect } from 'react-redux'
import CircularProgressbar from 'react-circular-progressbar'
import $ from 'jquery'
import classnames from 'classnames'

class ProfileProgress extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scrolled: false,
      progress: 0
    }
  }

  componentDidMount() {
    let _this = this
    let $window = $(window)
    let $wrapper = $('.profile-progress--wrapper')
    let $profilePicture = $('.profile-progress--wrapper .profile-picture')

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

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.scrolled && this.state.scrolled) {
      let _this = this
      setTimeout(function() {
        _this.setState({
          progress: 60
        })
      }, 500)
    }
  }

  render() {
    let { profile } = this.props
    let { scrolled, progress } = this.state

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
            profile.id +
            '/picture/500'
          }
          className="img-fluid profile-picture"
        />
        <div className="progress-circle">
          <CircularProgressbar
            percentage={progress}
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
  profile: state.profile
})

export default connect(mapStateToProps)(ProfileProgress)
