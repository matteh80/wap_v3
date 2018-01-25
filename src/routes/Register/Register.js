import React from 'react'
import PropTypes from 'prop-types'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { Container, Row, Col, Button } from 'reactstrap'
import SocialLogin from '../../layout/SocialLogin/SocialLogin'

class Register extends React.Component {
  render() {
    return (
      <div className="register-wrapper h-100">
        <Container fluid className="register-container h-100">
          <Row className="h-100">
            <Col xs={12} lg={5} xl={4} className="left-content p-5">
              <Row>
                <Col xs={12} className="text-center">
                  <img
                    src={
                      process.env.PUBLIC_URL + '/img/wap_logo_bee_wap_black.png'
                    }
                    className="register-logo"
                  />
                </Col>
                <Col xs={12}>
                  <SocialLogin />
                </Col>
                <Col xs={12} className="mt-5">
                  <AvForm>
                    <AvField name="first_name" label="Förnamn" required />
                    <AvField name="last_name" label="Efternamn" required />
                    <AvField
                      type="email"
                      name="email"
                      label="E-post"
                      required
                    />
                    <AvField
                      type="password"
                      name="password"
                      label="Lösenord"
                      required
                    />
                    <Button type="submit" className="w-100 mt-4">
                      Registrera
                    </Button>
                  </AvForm>
                </Col>
              </Row>
            </Col>
            <Col
              className="d-none d-lg-block"
              style={{ background: '#cdcdcd' }}
            />
          </Row>
        </Container>
      </div>
    )
  }
}

export default Register
