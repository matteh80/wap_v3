import React from 'react'
import { connect } from 'react-redux'
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import $ from 'jquery'
import cn from 'classnames'
import _ from 'lodash'

let counter
let tipFunc
class ProfileTips extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visibleTip: undefined,
      nextTip: undefined,
      availableTips: []
    }

    this.showTips = this.showTips.bind(this)
    this.getTips = this.getTips.bind(this)
  }

  componentDidMount() {
    const _this = this

    this.getTips(this.props.profile)

    tipFunc = setInterval(function() {
      _this.showTips()
    }, 7500)
  }

  componentWillUnmount() {
    clearInterval(tipFunc)
  }

  componentDidUpdate(prevProps, prevState) {
    const _this = this

    if (this.props.progressPercent !== prevProps.progressPercent) {
      $('.message').fadeOut(250, function() {
        _this.getTips(_this.props.profile)
        counter = null
      })
    }

    if (prevState.nextTip !== this.state.nextTip) {
      $('.message').fadeOut(250, function() {
        _this.setState({
          visibleTip: _this.state.nextTip
        })
      })
    }

    if (prevState.visibleTip !== this.state.visibleTip) {
      $('.message').fadeIn(250)
    }

    if (prevState.availableTips !== this.state.availableTips) {
      this.showTips()
    }
  }

  showTips() {
    const { availableTips } = this.state

    if (availableTips) {
      counter = (counter + 1) % availableTips.length

      if (isNaN(counter)) {
        counter = 0
      }

      this.setState({
        nextTip: availableTips[counter]
      })
    }
  }

  getLevelText(level) {
    switch (level) {
      case 0:
        return 'Osynlig profil'
      case 1:
        return 'Grundläggande profil'
      case 2:
        return 'Stark profil'
      case 3:
        return 'Fantastisk profil'
    }
  }

  handleClick(e, anchor) {
    e.preventDefault()
    e.stopPropagation()

    if ($(anchor).offset()) {
      $('html, body').animate({ scrollTop: $(anchor).offset().top - 220 }, 500)
    }
  }

  render() {
    const { progress } = this.props.profile
    const { visibleTip } = this.state

    const titleClass = cn(
      'text-center d-block mb-0',
      progress.onLevel < 1
        ? 'fg_level0'
        : progress.onLevel === 1
          ? 'fg_level1'
          : progress.onLevel === 2 ? 'fg_level2' : 'fg_level3'
    )

    return (
      <Card className="profile-tips">
        <CardBody>
          <CardTitle className={titleClass}>
            Profilnivå {progress.onLevel}
          </CardTitle>
          <CardSubtitle className="text-center d-block text-muted mb-3">
            {this.getLevelText(progress.onLevel)}
          </CardSubtitle>
          <div className="message w-100">{visibleTip}</div>
        </CardBody>
      </Card>
    )
  }

  getTips(profile) {
    const level = profile.progress.onLevel
    const tips = []

    // const missingPic =
    //   $('.profile-picture')
    //     .attr('src')
    //     .indexOf('noPic') !== -1
    //
    // if (missingPic)
    //   tips.push(
    //     <div>
    //       Företag är mer benägna att köpa profiler som har en profilbild. Ladda
    //       upp en nu!
    //     </div>
    //   )

    // Level 0
    if (level === 0) {
      let missingOnLevel = _.filter(profile.progress.items, item => {
        return item.level === 1 && !item.done
      })

      tips.push(
        <div>
          För att vara sök- och köpbar för arbetsgivare måste du minst ha nått{' '}
          <span className="fg_accent">
            <strong>profilnivå 1. </strong>
          </span>
          Du har{' '}
          {missingOnLevel.map((item, index) => {
            return (
              <span key={item.id}>
                <a href="#" onClick={e => this.handleClick(e, `#${item.id}`)}>
                  {item.name.toLowerCase()}
                </a>
                {index < missingOnLevel.length - 1 &&
                  index !== missingOnLevel.length - 2 &&
                  ', '}
                {index === missingOnLevel.length - 2 && ' och '}
              </span>
            )
          })}{' '}
          kvar att fylla i innan du når nivå 1.
        </div>
      )
    }

    // Level 1
    if (level === 1) {
      let missingOnLevel = _.filter(profile.progress.items, item => {
        return item.level === 2 && !item.done
      })

      tips.push(
        <div>
          Bra jobbat! Din profil är nu på första nivån vilket betyder att
          företag kan köpa din profil. Fyll på med mer information för att göra
          din profil mer intressant. Du har{' '}
          {missingOnLevel.map((item, index) => {
            return (
              <span>
                <a
                  key={item.id}
                  href="#"
                  onClick={e => this.handleClick(e, `#${item.id}`)}
                >
                  {item.name.toLowerCase()}
                </a>
                {index < missingOnLevel.length - 1 &&
                  index !== missingOnLevel.length - 2 &&
                  ', '}
                {index === missingOnLevel.length - 2 && ' och '}
              </span>
            )
          })}{' '}
          kvar att fylla i innan du når nivå 2.
        </div>
      )
    }

    tips.push(
      <div>
        Saknar du några kompetenser eller befattningar? Tipsa oss på
        info@workandpassion.se!
      </div>
    )

    this.setState({
      availableTips: tips
    })
  }
}

const mapStateToProps = state => ({
  profileLevel: state.profile.progress.onLevel,
  profile: state.profile,
  progressPercent: state.profile.progress.progressPercent
})

export default connect(mapStateToProps)(ProfileTips)
