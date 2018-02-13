import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Scrollspy from 'react-scrollspy'
import _ from 'lodash'
import $ from 'jquery'

class SideNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuItems: menuItems
    }

    this.setActiveOption = this.setActiveOption.bind(this)
  }
  componentDidMount() {}

  setActiveOption(e) {
    if (!e) return

    const newMenuItems = this.state.menuItems.map(
      menuItem =>
        menuItem.id === e.id
          ? { ...menuItem, isCurrent: true }
          : { ...menuItem, isCurrent: false }
    )

    this.setState({
      menuItems: newMenuItems
    })
  }

  handleClick(e, anchor) {
    e.preventDefault()
    e.stopPropagation()
    console.log(e.srcElement)

    $('html, body').animate({ scrollTop: $(anchor).offset().top - 100 }, 500)
  }

  render() {
    const { menuItems } = this.state
    return (
      <div className="profile-sidenav" id="profile-sidenav">
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
    const { name, id, icon, isCurrent } = this.props
    return (
      <li className={classnames('nav-item', isCurrent && 'is-current')}>
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
