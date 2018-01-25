import React from 'react'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { Container, Row, Col, Button } from 'reactstrap'
import SocialLogin from '../../layout/SocialLogin/SocialLogin'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { connect } from 'react-redux'
import { register } from '../../store/modules/auth'
import { updateProfile } from '../../store/modules/profile'

class Register extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.handleValidSubmit = this.handleValidSubmit.bind(this)
  }

  handleValidSubmit(event, values) {
    this.setState({ loading: true })

    let { dispatch } = this.props

    dispatch(register(values.email, values.password)).then(() => {
      dispatch(
        updateProfile({
          first_name: values.first_name,
          last_name: values.last_name,
          address: null,
          care_of: null,
          zip_code: null,
          city: null,
          phone_number: null,
          mobile_phone_number: values.mobile_phone_number,
          title: null,
          personal_info: null,
          linkedin_url: null
        })
      )
    })
  }

  render() {
    const { loading } = this.state

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
                  <AvForm onValidSubmit={this.handleValidSubmit}>
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
                      required
                      errorMessage="Du måste ange ett lösenord (minst 6 tecken)"
                    />
                    <AvField
                      type="password"
                      name="confirm_password"
                      label="Bekräfta lösenord"
                      required
                      validate={{ match: { value: 'password' } }}
                      errorMessage="Lösenorden matchar inte"
                    />
                    <LoadingButton
                      loading={loading}
                      text="Registrera"
                      loadingText="Registrerar dig..."
                    />
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

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps)(Register)
