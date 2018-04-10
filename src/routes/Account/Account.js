import React from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  Badge
} from 'reactstrap'
import faker from 'faker'

class Account extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} lg={4}>
            <Card>
              <CardBody>
                <CardTitle>Statistik</CardTitle>
                <Row className="account-stats">
                  <Col xs={12}>
                    <h5>
                      <div className="stats-icon">
                        <i className="fas fa-eye" />
                      </div>Visningar: 0
                    </h5>
                  </Col>
                  <Col xs={12}>
                    <h5>
                      <div className="stats-icon">
                        <i className="fas fa-shopping-cart" />
                      </div>Köp: 0
                    </h5>
                  </Col>
                  <Col xs={12}>
                    <h5>
                      <div className="stats-icon">
                        <i className="fas fa-comments" />
                      </div>Intervjuer: 0
                    </h5>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} lg={8}>
            <Card>
              <CardBody>
                <CardTitle>
                  Händelser <Badge>3</Badge>
                </CardTitle>
                <Row>
                  <h3>Inga händelser</h3>
                  {/*<h5 className="col-12">*/}
                  {/*<strong>{faker.company.companyName()}</strong> har köpt din*/}
                  {/*profil (+300 kr) <Badge color="accent">Ny</Badge>*/}
                  {/*</h5>*/}
                  {/*<h5 className="col-12">*/}
                  {/*<strong>{faker.company.companyName()}</strong> har köpt din*/}
                  {/*profil (+300 kr) <Badge color="accent">Ny</Badge>*/}
                  {/*</h5>*/}
                  {/*<h5 className="col-12">*/}
                  {/*<strong>{faker.company.companyName()}</strong> har köpt din*/}
                  {/*profil (+300 kr) <Badge color="accent">Ny</Badge>*/}
                  {/*</h5>*/}
                  {/*<h5 className="col-12">*/}
                  {/*<strong>{faker.company.companyName()}</strong> har köpt din*/}
                  {/*profil (+300 kr)*/}
                  {/*</h5>*/}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Account
