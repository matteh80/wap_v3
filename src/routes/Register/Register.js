import React from 'react'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { Container, Row, Col, Alert } from 'reactstrap'
import SocialLogin from '../../layout/SocialLogin/SocialLogin'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { connect } from 'react-redux'
import { register } from '../../store/modules/auth'
import { Link } from 'react-router-dom'
import axios from 'axios'
import TermsOfService from '../../components/TermsOfService'
import register_bg from './register_bg.jpg'
import register_bg_2 from './register_bg_2.jpg'
import register_bg_3 from './register_bg_3.jpg'
import logga_bla from './logga_bla.png'

class Register extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      cityValue: undefined,
      tosAccepted: false,
      bgImage: this.getBgImage(Math.floor(Math.random() * 3 + 1))
    }

    this.handleValidSubmit = this.handleValidSubmit.bind(this)
    this.onZipChange = this.onZipChange.bind(this)
    this.handleTosChange = this.handleTosChange.bind(this)
  }

  handleValidSubmit(event, values) {
    this.setState({ loading: true })

    let { dispatch } = this.props

    dispatch(
      register(
        values.email,
        values.password,
        Object.assign({}, defaultProfile, {
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          mobile_phone_number: values.mobile_phone_number,
          zip_code: values.zip_code,
          city: this.state.cityValue,
          tos_accepted: this.state.tosAccepted
        })
      )
    )
  }

  handleTosChange() {
    this.setState({
      tosAccepted: !this.state.tosAccepted
    })
  }

  onZipChange(e) {
    const value = e.target.value

    if (value.length === 5) {
      axios
        .get(
          'https://papapi.se/json/?z=' +
            value.substring(0, 3) +
            '+' +
            value.substring(3, 5) +
            '&token=f32f01cc4c6512fb2e36d54fb9e46bb21f939acf'
        )
        .then(result => {
          this.setState({
            cityValue: result.data.result[0].city
          })
        })
    } else {
      this.setState({
        cityValue: undefined
      })
    }
  }

  getBgImage(number) {
    switch (number) {
      case 2:
        return register_bg_2
      case 3:
        return register_bg_3
      default:
        return register_bg
    }
  }

  render() {
    const { cityValue, bgImage } = this.state
    const { registerError, registering } = this.props

    return (
      <div
        className="register-wrapper h-100"
        style={{
          backgroundImage: 'url("' + bgImage + '")',
          backgroundSize: 'cover'
        }}
      >
        <Container fluid className="register-container h-100">
          <Row className="h-100">
            <Col
              xs={12}
              lg={5}
              xl={4}
              className="left-content p-4 p-sm-5 bg-white"
            >
              <Row>
                <Col xs={12} className="text-center">
                  <img src={logga_bla} className="register-logo" />
                </Col>
                <Col xs={12}>
                  <SocialLogin />
                </Col>
                <Col xs={12} className="mt-5">
                  {registerError && (
                    <Alert color="danger">
                      {Object.keys(registerError).map(function(key) {
                        return registerError[key]
                      })}
                    </Alert>
                  )}
                  <AvForm onValidSubmit={this.handleValidSubmit}>
                    <AvField
                      type="email"
                      name="email"
                      label="E-post"
                      required
                      errorMessage="Ange en giltig epost-adress"
                    />
                    <AvField
                      type="password"
                      name="password"
                      label="Lösenord"
                      minLength={8}
                      required
                      errorMessage="Du måste ange ett lösenord (minst 8 tecken)"
                    />
                    <AvField
                      type="password"
                      name="confirm_password"
                      label="Bekräfta lösenord"
                      required
                      validate={{ match: { value: 'password' }, minLength: 8 }}
                      errorMessage="Lösenorden matchar inte"
                    />
                    <AvField
                      name="first_name"
                      label="Förnamn"
                      required
                      errorMessage="Du måste skriva in ditt förnamn"
                    />
                    <AvField
                      name="last_name"
                      label="Efternamn"
                      required
                      errorMessage="Du måste skriva in ditt efternamn"
                    />
                    <AvField
                      name="mobile_phone_number"
                      label="Mobiltelefon"
                      required
                      errorMessage="Du måste skriva in ett telefonnummer"
                    />
                    <Row className="align-items-center">
                      <Col xs={12} md={5} lg={4}>
                        <AvField
                          name="zip_code"
                          label="Postnummer"
                          required
                          minLength={5}
                          maxLength={5}
                          onBlur={this.onZipChange}
                          errorMessage="Du måste skriva in ditt postnummer (5 siffror)"
                        />
                      </Col>
                      <Col xs={12} md={7} lg={8}>
                        <h4 className="mt-3" id="cityValue">
                          {cityValue}
                        </h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <TermsOfService
                          isCollapsed={false}
                          onTosChange={this.handleTosChange}
                        />
                      </Col>
                    </Row>
                    <LoadingButton
                      loading={registering}
                      text="Registrera"
                      loadingText="Registrerar dig..."
                    />
                  </AvForm>
                </Col>
              </Row>
              <Row className="my-5">
                <Col xs={12}>
                  Har du redan ett konto? <Link to={'/login'}>Logga in!</Link>
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
  registerError: state.auth.registerError,
  registering: state.auth.registering,
  profile: state.profile
})

export default connect(mapStateToProps)(Register)

const defaultProfile = {
  title: '',
  care_of: '',
  address: 'Null',
  city: 'Null',
  linkedin_url: '',
  personal_info: '',
  phone_number: '',
  actively_searching: true
}
