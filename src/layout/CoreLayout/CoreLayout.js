import React from 'react'
import Header from '../Header/Header'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'
import { updateProfile } from '../../store/modules/profile'
import { logout } from '../../store/modules/auth'
import Notifications from 'react-notification-system-redux'

class CoreLayout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      changeLevel: false
    }

    this.tosAccepted = this.tosAccepted.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.onLevel !== this.props.onLevel) {
      const _this = this

      this.setState({
        changeLevel: true
      })

      setTimeout(function() {
        _this.setState({
          changeLevel: false
        })
      }, 1000)
    }
  }

  tosAccepted(accepted = true) {
    const { profile, updateProfile, logout } = this.props

    if (accepted) {
      const newProfile = Object.assign({}, defaultProfile, profile, {
        tos_accepted: accepted
      })

      console.log(newProfile)

      updateProfile(newProfile)
    } else {
      logout()
    }
  }

  render() {
    const { changeLevel } = this.state
    const { tos_accepted, onLevel, profile, notifications } = this.props
    return (
      <div
        className={classnames(
          'core-layout h-100',
          'level-' + onLevel,
          changeLevel && 'changeLevel'
        )}
      >
        <Header />
        <div className="main-content h-100">{this.props.children}</div>
        <Modal
          isOpen={!profile.fetchingProfile && !tos_accepted}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader>
            Innan du kan använda WAP måste du godkänna användaravtalen
          </ModalHeader>
          <ModalBody>Lorem Ipsum</ModalBody>
          <ModalFooter>
            <Button onClick={() => this.tosAccepted(true)}>
              Jag godkänner
            </Button>
            <Button color="text" onClick={() => this.tosAccepted(false)}>
              Jag godkänner INTE
            </Button>
          </ModalFooter>
        </Modal>
        <Notifications notifications={notifications} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  onLevel: state.profile.progress.onLevel,
  tos_accepted: state.profile.tos_accepted,
  profile: state.profile,
  notifications: state.notifications
})

export default connect(mapStateToProps, { updateProfile, logout })(CoreLayout)

const defaultProfile = {
  title: '',
  care_of: '',
  address: 'Null',
  city: 'Null',
  linkedin_url: '',
  personal_info: '',
  phone_number: '',
  first_name: 'Null',
  last_name: 'Null'
}
