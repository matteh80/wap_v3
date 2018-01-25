import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import noPicMale from './noPicMale.png'
import niPicFemale from './noPicFemale.png'
import { logout } from '../../store/modules/auth'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }

    this.toggle = this.toggle.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
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
        <Navbar color="faded" dark expand="md" className="bg-primary">
          <Container>
            <NavbarBrand href="/">Work and Passion</NavbarBrand>
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
                <UncontrolledDropdown nav className="d-none d-md-block">
                  <DropdownToggle nav caret>
                    <img src={noPicMale} className="profile-picture" />
                    <span className="d-md-none d-lg-inline">
                      {' '}
                      {profile.first_name} {profile.last_name}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>Option 1</DropdownItem>
                    <DropdownItem>Option 2</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.handleLogout}>
                      Logga ut
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default withRouter(connect(mapStateToProps)(Header))
