import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledTooltip
} from 'reactstrap'
import $ from 'jquery'
import { logout } from '../../store/modules/auth'
import headerLogo from './headerLogo.png'
import Slider from 'rc-slider'
import _ from 'lodash'
import PropTypes from 'prop-types'
import Scrollspy from 'react-scrollspy'
import HeaderProgress from './components/HeaderProgress/HeaderProgress'
import cn from 'classnames'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }

    this.toggle = this.toggle.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    const $window = $(window)
    const $header = $('.header')
    const $headerBottom = $('#header-bottom')
    const $shouldFade = $('.shouldFade')

    $window.scroll(function() {
      let minHeight = parseInt(
        $headerBottom.css('min-height').replace('px', '')
      )
      let max = -$headerBottom.outerHeight() + minHeight
      let newMargin = -$window.scrollTop()

      if (max > newMargin) {
        newMargin = max
      }

      $headerBottom.css({
        marginTop: newMargin
      })

      $shouldFade.css({ opacity: 1 - $window.scrollTop() / 60 })

      if ($window.scrollTop() > 200) {
        $headerBottom.addClass('collapsed')
      } else {
        $headerBottom.removeClass('collapsed')
      }
    })
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  handleLogout(e) {
    e.preventDefault()
    let { dispatch } = this.props
    dispatch(logout())
  }

  render() {
    const { profile, progress } = this.props
    const path = this.props.pathname.replace('/', '')

    return (
      <header className={cn('header', 'header-' + path)}>
        <Container>
          <Navbar color="faded" dark expand="lg">
            <NavbarBrand href="/">
              <img src={headerLogo} id="header--logo" />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink to="/account" className="nav-link">
                    Mitt konto
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/profile" className="nav-link">
                    Profil
                  </NavLink>
                </NavItem>
                <NavItem>
                  <div className="nav-link" onClick={this.handleLogout}>
                    Logga ut
                  </div>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          <div id="header-bottom">
            <Container className="h-100">
              <Row className="h-100 align-items-center shouldFade">
                <Col xs={12} md={9}>
                  <h1 className="candidate-name mb-0">
                    {profile.first_name + ' ' + profile.last_name}
                  </h1>
                  <h3 className="candidate-subtitle">{profile.title}</h3>
                  {/*<Progress value={50} />*/}
                </Col>
                <Col xs={12} md={3} className="profile-stats">
                  <Row>
                    <Col xs={6} className="profile-stats-icon">
                      <i className="fas fa-dollar-sign mr-xl-2" />
                      0
                    </Col>
                    <Col xs={6} className="profile-stats-icon">
                      <i className="fas fa-eye mr-xl-2" />
                      0
                    </Col>
                  </Row>
                </Col>
              </Row>
              <HeaderProgress progress={progress} />
            </Container>
          </div>
        </Container>
      </header>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  progress: state.profile.progress,
  pathname: state.routing.location.pathname
})

export default withRouter(connect(mapStateToProps)(Header))

class HeaderProgressOld extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuItems: _.values(props.progress.items)
    }
  }
  getTooltips() {
    const { items } = this.props.progress
    let mArray = _.values(items)
    mArray.sort(function(a, b) {
      if (a.done && !b.done) {
        return -1
      } else if (!a.done && b.done) {
        return 1
      } else {
        return 0
      }
    })

    return mArray.map(item => (
      <div
        key={item.id}
        className="tooltip-target"
        id={'tooltip-target-' + item.id}
        data-id={item.id}
        onClick={e => this.handleClick(e, `#${item.id}`)}
      >
        <UncontrolledTooltip
          delay={0}
          placement="bottom"
          target={'tooltip-target-' + item.id}
        >
          {item.name}
        </UncontrolledTooltip>
      </div>
    ))
  }

  handleClick(e, anchor) {
    e.preventDefault()
    e.stopPropagation()

    if ($(anchor).offset()) {
      $('html, body').animate({ scrollTop: $(anchor).offset().top - 120 }, 500)
    }
  }

  handleUpdate(e) {
    let $marker = $('#marker')
    let $tooltipHolder = $('.tooltip-holder')
    let $active = $('#tooltip-target-' + e.id)

    let holderOffsetLeft = $tooltipHolder.offset().left
    let activeOffsetLeft = $active.offset().left
    console.log(holderOffsetLeft)
    console.log(activeOffsetLeft)
    let leftValue =
      holderOffsetLeft -
      activeOffsetLeft -
      $active.width() / 2 +
      $marker.width() / 2
    $marker.css('left', -leftValue)
  }

  render() {
    const { progress } = this.props

    return (
      <div className="slider-wrapper">
        <Slider
          min={0}
          max={_.size(progress.items)}
          // max={12}
          dots
          value={progress.doneItems ? progress.doneItems.length : 0}
          disabled={true}
        />

        <div className="tooltip-holder d-flex">
          <i className="fas fa-map-marker" id="marker" />
          <Scrollspy
            items={_.map(this.state.menuItems, 'id')}
            offset={-300}
            currentClassName="active"
            onUpdate={this.handleUpdate}
          >
            {this.getTooltips()}
          </Scrollspy>
        </div>
      </div>
    )
  }
}

HeaderProgressOld.propTypes = {
  progress: PropTypes.number.isRequired
}
