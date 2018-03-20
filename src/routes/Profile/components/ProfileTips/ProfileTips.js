import React from 'react'
import { connect } from 'react-redux'
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap'
import $ from 'jquery'
import cn from 'classnames'
import _ from 'lodash'

let counter = 0
class ProfileTips extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visibleTip: undefined,
      nextTip: undefined,
      availableTips: _.values(tips)
    }

    this.showTips = this.showTips.bind(this)
  }

  componentDidMount() {
    const _this = this

    _this.showTips()
    setInterval(function() {
      _this.showTips()
    }, 3000)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.visibleTip !== this.state.visibleTip) {
    }
  }

  showTips() {
    const { availableTips } = this.state
    const { progress } = this.props.profile

    counter = (counter + 1) % availableTips.length

    this.setState({
      nextTip: availableTips[counter]
    })
  }

  render() {
    const { progress } = this.props.profile
    const { visibleTip } = this.state

    const titleClass = cn(
      'text-center d-block mb-0',
      progress.onLevel < 1
        ? 'fg_red'
        : progress.onLevel === 1 ? 'fg_accent' : 'fg_secondary'
    )

    return (
      <Card className="profile-tips">
        <CardBody>
          <CardTitle className={titleClass}>
            Profilnivå {progress.onLevel}
          </CardTitle>
          <CardSubtitle className="text-center d-block text-muted mb-3">
            Grundläggande profil
          </CardSubtitle>
          <div className="message w-100">{visibleTip}</div>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(ProfileTips)

const tips = {
  no_picture: (
    <div>
      Företag är mer benägna att köpa loss profiler som har en profilbild. Ladda
      upp en bild nu!
    </div>
  ),
  level0_start: (
    <div>
      För att vara sök- och köpbar måste din profil minst vara klar med{' '}
      <span className="fg_accent">nivå 1</span>.
    </div>
  ),
  level0_profile_done: <div>Jadda jadda!!!</div>
}
