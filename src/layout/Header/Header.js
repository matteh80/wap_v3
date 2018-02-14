import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
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
  NavLink,
  Progress
} from 'reactstrap'
import $ from 'jquery'
import { logout } from '../../store/modules/auth'
import headerLogo from './headerLogo.png'
import Slider from 'rc-slider'

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
    })
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  handleLogout() {
    let { dispatch } = this.props
    dispatch(logout())
  }

  render() {
    let { profile } = this.props
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
                  <NavLink href="https://github.com/reactstrap/reactstrap">
                    Konto
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/logout/" onClick={this.handleLogout}>
                    Logga ut
                  </NavLink>
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
                  <Col xs={12} md={6}>
                    <Slider min={1} max={10} dots value={6} disabled={true} />
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
  profile: state.profile
})

export default withRouter(connect(mapStateToProps)(Header))
