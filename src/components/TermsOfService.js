import React from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'reactstrap'
import Checkbox from './Checkbox/Checkbox'

class TermsOfService extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: this.props.isCollapsed ? !this.props.isCollapsed : false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle(e) {
    e.preventDefault()

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const { onTosChange } = this.props
    const { isOpen } = this.state
    return (
      <div>
        <Collapse isOpen={isOpen}>
          <small>
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
              överlämnat eller laddat upp material såsom bilder, film- eller
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
          </small>
        </Collapse>
        <Checkbox
          onChange={onTosChange}
          name="tos_accepted"
          label={
            <span>
              Jag godkänner{' '}
              <a href="#" onClick={this.toggle}>
                användaravtalet
              </a>
            </span>
          }
        />
      </div>
    )
  }
}

export default TermsOfService

TermsOfService.propTypes = {
  isCollapsed: PropTypes.bool,
  onTosChange: PropTypes.func
}
