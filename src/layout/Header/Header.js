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
  NavLink
} from 'reactstrap'
import $ from 'jquery'
import { logout } from '../../store/modules/auth'
import headerLogo from './headerLogo.png'

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

    $window.scroll(function() {
      $headerBottom.css({
        height: 180 - $window.scrollTop(),
        opacity: 1 - $window.scrollTop() / 180
      })
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
        <Navbar color="faded" dark expand="never">
          <Container>
            <NavbarBrand href="/">
              <img src={headerLogo} id="header--logo" />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="/components/">Components</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/reactstrap/reactstrap">
                    Github
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <div id="header-bottom">
          <Container className="h-100">
            <Row className="h-100 align-items-end">
              <Col xs={12} md={{ size: 9, offset: 3 }} className="mb-2">
                <h1 className="candidate-name mb-0">
                  {profile.first_name + ' ' + profile.last_name}
                </h1>
                <h3 className="candidate-subtitle mt-0">{profile.title}</h3>
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
