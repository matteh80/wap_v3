import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import { Container, Row, Col, Alert } from 'reactstrap'
import SocialLogin from '../../layout/SocialLogin/SocialLogin'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { login } from '../../store/modules/auth'
import moln_flat from './moln_flat.jpg'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.handleValidSubmit = this.handleValidSubmit.bind(this)
  }

  handleValidSubmit(event, values) {
    let { login } = this.props
    login(values.email, values.password)
  }

  render() {
    const { loggingIn, loginError } = this.props
    return (
      <div
        className="login-wrapper h-100"
        style={{ background: 'url("' + moln_flat + '")' }}
      >
        <Container fluid className="login-container h-100">
          <Row className="h-100">
            <Col
              xs={12}
              lg={5}
              xl={4}
              className="left-content p-4 p-sm-5 bg-white"
            >
              <Row>
                <Col xs={12} className="text-center">
                  <img
                    src={
                      process.env.PUBLIC_URL + '/img/wap_logo_bee_wap_black.png'
                    }
                    className="login-logo"
                  />
                </Col>
                <Col xs={12}>
                  <SocialLogin />
                </Col>
                <Col xs={12} className="mt-5">
                  {loginError && (
                    <Alert color="danger">
                      Det gick inte att logga in med de här uppgifterna.
                    </Alert>
                  )}
                  <AvForm onValidSubmit={this.handleValidSubmit}>
                    <AvGroup>
                      <AvField
                        type="email"
                        name="email"
                        label="E-post"
                        required
                        errorMessage="Ange en giltig epost-adress"
                      />
                    </AvGroup>
                    <AvField
                      type="password"
                      name="password"
                      label="Lösenord"
                      required
                      errorMessage="Lösenord måste bestå av minst 6 tecken"
                    />
                    <LoadingButton
                      loading={loggingIn}
                      text="Logga in"
                      loadingText="Loggar in..."
                    />
                  </AvForm>
                </Col>
              </Row>
              <Row className="my-5">
                <Col xs={12}>
                  Har du inget konto?{' '}
                  <Link to={'/register'}>Registrera dig!</Link>
                </Col>
              </Row>
              <Row className="copyright my-5">
                <Col xs={12}>
                  <small>
                    ©2018 All Rights Reserved. WAP® is a registered trademark.
                    Privacy and Terms
                  </small>
                </Col>
              </Row>
            </Col>
            <Col className="d-none d-lg-block" />
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loggingIn: state.auth.loggingIn,
  loginError: state.auth.loginError
})

export default connect(mapStateToProps, { login })(Login)
