import React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap'
import $ from 'jquery'
import ProfileProgress from './components/ProfileProgress/ProfileProgress'
import EmploymentsCard from './components/EmploymentsCard/EmploymentsCard'
import SkillsCard from './components/SkillsCard/SkillsCard'
import LanguagesCard from './components/LanguagesCard/LanguagesCard'
import OccupationsCard from './components/OccupationsCard/OccupationsCard'
import SideNav from './components/SideNav/SideNav'

class Profile extends React.Component {
  componentDidMount() {
    $(window).scroll(function() {
      $('#profile-sidenav').css('top', $('.header').height() + 40)
    })
  }

  render() {
    let { profile } = this.props
    return (
      <div>
        <SideNav />
        <Container className="profile">
          <Row>
            <Col xs={12} md={3} className="left fixed d-none d-md-block">
              {/*<Card className="profile-menu-card">*/}
              {/*<div className="picture-wrapper">*/}
              {/*<CardImg*/}
              {/*src={*/}
              {/*'https://api.wapcard.se/api/v1/profiles/' +*/}
              {/*profile.id +*/}
              {/*'/picture/500'*/}
              {/*}*/}
              {/*className="img-fluid profile-picture"*/}
              {/*/>*/}

              {/*<div className="progress-wrapper">*/}
              {/*<Progress value={50} />*/}
              {/*<small className="text-center mb-3 d-none">*/}
              {/*Din profil är 50% klar*/}
              {/*</small>*/}
              {/*</div>*/}
              {/*</div>*/}
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
              <Card className="mb-5" id="educations">
                <CardBody className="py-5">Test</CardBody>
              </Card>
              <SkillsCard />
              <OccupationsCard />
              <LanguagesCard />

              <Card className="mb-5">
                <CardBody className="py-5">Test</CardBody>
              </Card>
              <Card className="mb-5">
                <CardBody className="py-5">Test</CardBody>
              </Card>
              <Card className="mb-5">
                <CardBody className="py-5">Test</CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(Profile)
