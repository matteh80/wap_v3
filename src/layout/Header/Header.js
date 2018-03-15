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
    let $window = $(window)
    let $header = $('.header')
    let $headerBottom = $('#header-bottom')
    let $profileProgress = $('.progress-wrapper .progress')

    $window.scroll(function() {
      $headerBottom.css({
        height: 180 - $window.scrollTop(),
        opacity: 1 - $window.scrollTop() / 160
      })

      if ($window.scrollTop() > 180) {
        $profileProgress.addClass('visible')
      } else {
        $profileProgress.removeClass('visible')
      }

      if ($headerBottom.height() < 10) {
        $header.addClass('collapsed')
      } else {
        $header.removeClass('collapsed')
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

  getTooltips() {
    const { items } = this.props.profile.progress
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
      >
        <UncontrolledTooltip
          placement="bottom"
          target={'tooltip-target-' + item.id}
        >
          {item.name}
        </UncontrolledTooltip>
      </div>
    ))
  }

  render() {
    let { profile, progress } = this.props
    return (
      <header className="header">
        <Navbar color="faded" dark expand="lg">
          <Container>
            <NavbarBrand href="/">
              <img src={headerLogo} id="header--logo" />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink to="/account" className="nav-link">
                    Konto
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
          </Container>
        </Navbar>
        <div id="header-bottom">
          <Container className="h-100">
            <Row className="h-100 align-items-end">
              <Col xs={12} md={{ size: 9, offset: 3 }} className="mb-2 mb-3">
                <h1 className="candidate-name mb-0">
                  {profile.first_name + ' ' + profile.last_name}
                </h1>
                <h3 className="candidate-subtitle">{profile.title}</h3>
                {/*<Progress value={50} />*/}
                <Row>
                  <Col xs={12} md={6} className="slider-wrapper">
                    <Slider
                      min={0}
                      max={_.size(progress.items)}
                      dots
                      value={progress.doneItems ? progress.doneItems.length : 0}
                      disabled={true}
                    />
                    <div className="tooltip-holder d-flex">
                      {this.getTooltips()}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  progress: state.profile.progress
})

export default withRouter(connect(mapStateToProps)(Header))
