import React from 'react'
import { connect } from 'react-redux'
import Scrollspy from 'react-scrollspy'
import $ from 'jquery'
import _ from 'lodash'
import cn from 'classnames'

class HeaderProgress extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuItems: _.values(props.progress.items)
    }
  }

  handleClick(e, anchor) {
    e.preventDefault()
    e.stopPropagation()

    if ($(anchor).offset()) {
      $('html, body').animate({ scrollTop: $(anchor).offset().top - 220 }, 500)
    }
  }

  getSteps() {
    const { progress } = this.props
    const { items } = this.props.progress
    let mArray = _.values(items)

    return mArray.map((item, index) => {
      const nextItem = mArray[index + 1]

      return (
        <div
          key={item.id}
          className={cn(
            'progress-step-wrapper',
            'level-' + item.level,
            item.done && 'done'
          )}
          onClick={e => this.handleClick(e, `#${item.id}`)}
        >
          <div className="icon-wrapper">
            <i className={cn('fas', item.icon)} />
          </div>
          <div className="arrow" />
          <div className="progress-step" />
        </div>
      )
    })
  }

  render() {
    return (
      <div id="header-progress">
        <div id="header-progress-step-wrapper">
          <Scrollspy
            items={_.map(this.state.menuItems, 'id')}
            offset={-300}
            currentClassName="active"
            componentTag={'div'}
          >
            {this.getSteps()}
          </Scrollspy>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  progress: state.profile.progress
})

export default HeaderProgress
