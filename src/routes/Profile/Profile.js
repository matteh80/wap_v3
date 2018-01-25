import React from 'react'
import { Container, Row, Col, Card, CardBody } from 'reactstrap'
import SkillsCard from './components/SkillsCard/SkillsCard'

class Profile extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} md={4}>
            <Card>
              <CardBody />
            </Card>
          </Col>
          <Col xs={12} md={8}>
            <SkillsCard />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Profile
