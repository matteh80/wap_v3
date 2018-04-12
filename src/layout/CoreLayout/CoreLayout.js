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
            Innan du kan använda WAP måste du godkänna det uppdaterade
            användaravtalet
          </ModalHeader>
          <ModalBody>
            <p>
              Den information som du uppger i din Work and Passion-profil lagras
              i vår databas för att vi i Maxkompetens (koncernen (nedan
              företaget)) ska kunna administrera din Work and Passion-profil och
              matcha den mot lämpliga karriärsutmaningar. Uppgifterna kan
              förekomma skriftligen, muntligen, som bild, film- eller
              ljudinspelning. Vi garanterar att dina uppgifter inte kommer att
              användas i andra sammanhang eller av andra företag utan ditt
              medgivande. Vårt dataregister samkörs inte med register från
              tredje part. Upphovsrätt, under förutsättning att du har
              överlämnat eller laddat upp meterial såsom bilder, film- eller
              ljudinspelningar till företaget, alternativt på annat sätt
              registrerat dem i företagets system, överlåter du genom
              godkännande av integritetsvillkoren samtliga dina eventuella
              rättigheter av material till företaget. Du ansvarar själv för att
              innehållet är aktuellt och återspeglar din status.
            </p>
            <p>
              All insamling och behandling av personuppgifter sker i enlighet
              med PuL. Med personuppgifter avses alla uppgifter som kan användas
              för att identifiera en person, till exempel namn, hemadress och
              e-postadress. Med behandling av personuppgifter avses alla
              åtgärder som vidtas med personuppgifter såsom exempelvis
              insamling, lagring och bearbetning. För att skydda integriteten
              för dina personuppgifter som du överför via användningen av vår
              tjänst, vidtar vi lämpliga tekniska och organisatoriska
              skyddsåtgärder. Vi uppdaterar och testar kontinuerligt vår
              säkerhetsteknik. Vill du veta mer om PuL, läs vidare på
              www.datainspektionen.se. Om du samtycker till att dina uppgifter
              lagras så måste du markera kryssrutan för godkännande innan du
              kommer vidare till din Work and Passion-profil.
            </p>
          </ModalBody>
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
