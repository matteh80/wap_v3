import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import { Container, Row, Col, Alert } from 'reactstrap'
import SocialLogin from '../../layout/SocialLogin/SocialLogin'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { login } from '../../store/modules/auth'
import login_bg from './login_bg.jpg'
import login_bg_2 from './login_bg_2.jpg'
import login_bg_3 from './login_bg_3.jpg'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bgImage: this.getBgImage(Math.floor(Math.random() * 3 + 1))
    }

    this.handleValidSubmit = this.handleValidSubmit.bind(this)
  }

  handleValidSubmit(event, values) {
    let { login } = this.props
    login(values.email, values.password)
  }

  getBgImage(number) {
    switch (number) {
      case 2:
        return login_bg_2
      case 3:
        return login_bg_3
      default:
        return login_bg
    }
  }

  render() {
    const { loggingIn, loginError } = this.props
    const { bgImage } = this.state

    return (
      <div
        className="login-wrapper h-100"
        style={{
          background: 'url("' + bgImage + '")'
        }}
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
                <Col xs={12}>
                  <small>
                    <a href="https://app.workandpassion.se/password/reset/">
                      Glömt ditt lösenord?
                    </a>
                  </small>
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
            <Col className="right-content d-none d-lg-block">
              <div className="d-flex flex-column h-100 justify-content-center fg-white p-5">
                <h1 className="display-3 font-weight-bold title">
                  Att söka jobb är ett jobb i sig.<br /> Och jobb ska man få
                  betalt för.
                </h1>
                <h3 className="subtitle">
                  Matching värd vaje krona och sekund
                </h3>
                <span className="py-5">
                  Genom oss matchas du med seriösa arbetsgivare och tjänar
                  pengar på kuppen. Ju mer information de vill ha om dig, desto
                  mer betalt får du. Och skulle du bli kallad till intervju
                  eller rent utav få drömjobbet, då väntar en bonus. Bra va?
                </span>
              </div>
            </Col>
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
