import React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap'
import $ from 'jquery'
import ProfileProgress from './components/ProfileProgress/ProfileProgress'
import EmploymentsCard from './components/EmploymentsCard/EmploymentsCard'
import SkillsCard from './components/SkillsCard/SkillsCard'
import LanguagesCard from './components/LanguagesCard/LanguagesCard'
import OccupationsCard from './components/OccupationsCard/OccupationsCard'
// import SideNav from './components/SideNav/SideNav'
import EducationsCard from './components/EducationsCard/EducationsCard'
import LicensesCard from './components/LicensesCard/LicensesCard'
import MotivationsCard from './components/MotivationsCard/MotivationsCard'
import PersonalitiesCard from './components/PersonalitiesCard/PersonalitiesCard'
import { setProfileProgress } from '../../store/modules/profile'

class Profile extends React.Component {
  componentDidMount() {
    $(window).scroll(function() {
      $('#profile-sidenav').css('top', $('.header').height() + 40)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.props.dispatch(setProfileProgress())
    }
  }

  render() {
    return (
      <div>
        {/*<SideNav />*/}
        <Container className="profile">
          <Row>
            <Col xs={12} md={3} className="left fixed d-none d-md-block">
              <Card className="profile-tips">
                <CardBody>
                  <CardTitle>Tips</CardTitle>
                  Bacon ipsum dolor amet alcatra pork loin strip steak tail
                  turducken swine drumstick pork chop t-bone. Tail ham
                  burgdoggen filet mignon. Bacon flank meatloaf kielbasa.
                  Kielbasa picanha burgdoggen hamburger kevin chuck ham
                  drumstick sirloin rump capicola cow.
                </CardBody>
              </Card>
              <ProfileProgress />
            </Col>
            <Col xs={12} md={9} className="right">
              <EmploymentsCard />
              <EducationsCard />
              <SkillsCard />
              <OccupationsCard />
              <LanguagesCard />
              <PersonalitiesCard />
              <MotivationsCard />
              <LicensesCard />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userEmployments: state.employments.userEmployments,
  userSkills: state.skills.userSkills,
  userLanguages: state.languages.userLanguages,
  userOccupations: state.occupations.userOccupations,
  userDrivinglicenses: state.drivinglicenses.userDrivinglicenses,
  userMotivations: state.motivations.userMotivations,
  userPersonalities: state.personalities.userPersonalities
})

export default connect(mapStateToProps)(Profile)
