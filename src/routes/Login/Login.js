import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation'
import { Container, Row, Col, Button } from 'reactstrap'
import SocialLogin from '../../layout/SocialLogin/SocialLogin'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { login } from '../../store/modules/auth'
import { fetchProfile } from '../../store/modules/profile'
import login_bg from './login_bg.jpg'
import moln_flat from './moln_flat.jpg'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      loadingStep: 0
    }

    this.handleValidSubmit = this.handleValidSubmit.bind(this)
  }

  handleValidSubmit(event, values) {
    this.setState({ loading: true })

    let fnArray = [fetchProfile()]

    let { dispatch } = this.props
    dispatch(login(values.email, values.password)).then(() => {
      fnArray.map((fn, index) => {
        dispatch(fn).then(() => {
          // this.setState({
          //   loadingStep: this.state.loadingStep + 1
          // })
        })
      })
    })
  }

  render() {
    let { loading, loadingStep } = this.state
    return (
      <div
        className="login-wrapper h-100"
        style={{ background: 'url("' + moln_flat + '")' }}
      >
        <Container fluid className="login-container h-100">
          <Row className="h-100">
            <Col xs={12} lg={5} xl={4} className="left-content p-5 bg-white">
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
                      loading={loading}
                      text="Logga in"
                      loadingText="Loggar in..."
                      totSteps={9}
                      finishedStep={loadingStep}
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
  auth: state.auth
})

export default connect(mapStateToProps)(Login)

Login.propTypes = {}
