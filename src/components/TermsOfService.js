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
  }

  render() {
    const { onTosChange } = this.props
    const { isOpen } = this.state
    return (
      <div>
        <Collapse isOpen={isOpen}>
          <small>
            De uppgifter som du uppger i din profil lagras i vår databas för att
            vi i Maxkompetens koncernen (nedan företaget) ska kunna administrera
            din profil och matcha det mot lämpliga karriärsutmaningar.
            Uppgifterna kan förekomma skriftligen, muntligen eller som bild,
            film- eller ljudinspelning. Vi garanterar att dina uppgifter inte
            kommer att användas i andra sammanhang eller av andra företag utan
            ditt medgivande. Vårt dataregister samkörs inte med register från
            tredje part. Upphovsrätt, under förutsättning att du har överlämnat
            eller laddat upp meterial såsom bilder, film- eller ljudinspelningar
            till företaget, alternativt på annat sätt registrerat dem i
            företagets system, överlåter du genom godkännande av
            integritetsvillkoren samtliga dina eventuella rättigheter av
            material till företaget. Du kan när som helst ändra eller radera
            dina uppgifter i din profil. Efter 24 månader av inaktivitet kommer
            din profil raderas automatiskt. Du ansvarar själv för att innehållet
            är aktuellt och återspeglar din status. All insamling och behandling
            av personuppgifter sker i enlighet med bestämmelserna i
            dataskyddsförordningen - GDPR. Med personuppgifter avses alla
            uppgifter som kan användas för att identifiera en person, till
            exempel namn, hemadress och e-postadress. Med behandling av
            personuppgifter avses alla åtgärder som vidtas med personuppgifter
            såsom exempelvis insamling, lagring och bearbetning. Vill du veta
            mer om dataskyddsförordningen – GDPR, läs vidare på
            www.datainspektionen.se. Enligt dataskyddsförordningen - GDPR får
            ingen registrering ske utan personens medgivande. Om du samtycker
            till att dina uppgifter lagras så måste du markera kryssrutan för
            godkännande innan du kommer vidare.
          </small>
        </Collapse>
        <Checkbox
          onChange={onTosChange}
          name="tos_accepted"
          label={
            <span>
              Jag godkänner{' '}
              <a
                href="#"
                onClick={() => this.setState({ isOpen: !this.state.isOpen })}
              >
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
