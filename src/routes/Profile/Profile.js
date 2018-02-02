import React from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardImg,
  Progress
} from 'reactstrap'
import SkillsCard from './components/SkillsCard/SkillsCard'
import LanguagesCard from './components/LanguagesCard/LanguagesCard'

class Profile extends React.Component {
  componentDidMount() {}

  render() {
    let { profile } = this.props
    return (
      <Container className="profile">
        <Row>
          <Col xs={12} md={3} className="left fixed d-none d-md-block">
            <Card className="profile-menu-card">
              <CardImg
                src={
                  'https://api.wapcard.se/api/v1/profiles/' +
                  profile.id +
                  '/picture/500'
                }
                className="img-fluid profile-picture"
              />
              <CardBody>
                <Progress value={50} />
                <small className="text-center mb-3 d-block">
                  Din profil är 50% klar
                </small>
                <div className="sidemenu">
                  <h6>Anställningar</h6>
                  <h6>Utbildningar</h6>
                  <h6>Kompetenser</h6>
                  <h6>Språk</h6>
                  <h6>Körkort</h6>
                  <h6>Referenser</h6>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={9} className="right">
            <SkillsCard />
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
            <Card className="mb-5">
              <CardBody className="py-5">Test</CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps)(Profile)
