import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Scrollspy from 'react-scrollspy'
import _ from 'lodash'
import $ from 'jquery'

const SCROLL_DIR_DOWN = 'down'
const SCROLL_DIR_UP = 'up'

class SideNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuItems: menuItems,
      direction: SCROLL_DIR_DOWN,
      lastScrollPos: 0
    }

    this.setActiveOption = this.setActiveOption.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tempMenuItems !== this.state.tempMenuItems) {
      this.setState({
        menuItems: this.state.tempMenuItems
      })
    }
  }

  setActiveOption(e) {
    if (!e) return

    const newMenuItems = this.state.menuItems.map(
      menuItem =>
        menuItem.id === e.id
          ? { ...menuItem, isCurrent: true, isPrev: null }
          : menuItem.isCurrent
            ? { ...menuItem, isCurrent: false, isPrev: true }
            : { ...menuItem, isCurrent: false, isPrev: null }
    )

    let prevIndex = _.findIndex(newMenuItems, { isPrev: true })
    let currentIndex = _.findIndex(newMenuItems, { isCurrent: true })

    this.setState({
      direction: prevIndex < currentIndex ? SCROLL_DIR_DOWN : SCROLL_DIR_UP,
      tempMenuItems: newMenuItems
    })
  }

  handleClick(e, anchor) {
    e.preventDefault()
    e.stopPropagation()

    if ($(anchor).offset()) {
      $('html, body').animate({ scrollTop: $(anchor).offset().top - 200 }, 500)
    }
  }

  render() {
    const { menuItems, direction } = this.state
    return (
      <div
        className={classnames('profile-sidenav d-none d-md-block', direction)}
        id="profile-sidenav"
      >
        <Scrollspy
          items={_.map(menuItems, 'id')}
          offset={-80}
          onUpdate={this.setActiveOption}
        >
          {menuItems.map(menuItem => (
            <NavItem
              key={menuItem.id}
              name={menuItem.name}
              id={menuItem.id}
              icon={menuItem.icon}
              isCurrent={menuItem.isCurrent}
              isPrev={menuItem.isPrev}
              onClick={this.handleClick}
            />
          ))}
        </Scrollspy>
      </div>
    )
  }
}

export default SideNav

const menuItems = [
  // { name: 'Profil', id: 'profile', icon: 'fa-user' },
  {
    name: 'Anställningar',
    id: 'employments',
    icon: 'fa-briefcase',
    isCurrent: false
  },
  {
    name: 'Utbildningar',
    id: 'educations',
    icon: 'fa-graduation-cap',
    isCurrent: false
  },
  {
    name: 'Kompetenser',
    id: 'skills',
    icon: 'fa-rocket',
    isCurrent: false
  },
  {
    name: 'Befattningar',
    id: 'occupations',
    icon: 'fa-tags',
    isCurrent: false
  },
  {
    name: 'Språk',
    id: 'languages',
    icon: 'fa-comments',
    isCurrent: false
  }
]

class NavItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { name, id, icon, isCurrent, isPrev } = this.props
    return (
      <li
        className={classnames(
          'nav-item',
          isCurrent && 'is-current',
          isPrev && 'is-prev'
        )}
      >
        <a href={`#${id}`} onClick={e => this.props.onClick(e, `#${id}`)}>
          <div className="icon">
            <i className={`fa ${icon}`} />
          </div>
          <div className="nav-text">{name}</div>
        </a>
      </li>
    )
  }
}

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired
}
