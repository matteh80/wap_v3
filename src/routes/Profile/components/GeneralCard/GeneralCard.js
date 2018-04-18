import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import { Row, Col } from 'reactstrap'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import cn from 'classnames'
import {
  fetchProfile,
  setProfileProgress,
  updateProfile
} from '../../../../store/modules/profile'
import GoogleMapReact from 'google-map-react'
import moment from 'moment'
import Checkbox from '../../../../components/Checkbox/Checkbox'
import Slider from 'rc-slider'

class GeneralCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addMode: false,
      tmpProfile: {}
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.handleValidSubmit = this.handleValidSubmit.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleAvailabilityChange = this.handleAvailabilityChange.bind(this)
  }

  componentDidMount() {
    let { dispatch, profile } = this.props

    dispatch(fetchProfile()).then(result => {
      this.setState({
        tmpProfile: {
          actively_searching: profile.actively_searching,
          student: profile.student,
          availability: profile.availability
        }
      })
    })
  }

  cbAddMode(addMode) {
    if (addMode) {
      this.setState({
        addMode: addMode
      })
    } else {
      this.form.submit()
    }
  }

  handleCheckboxChange(name) {
    this.setState({
      tmpProfile: {
        ...this.state.tmpProfile,
        [name]: !this.state.tmpProfile[name]
      }
    })
  }

  handleAvailabilityChange(value) {
    this.setState({
      tmpProfile: {
        ...this.state.tmpProfile,
        availability: value
      }
    })
  }

  handleValidSubmit(event, values) {
    const { dispatch, profile } = this.props
    const { tmpProfile } = this.state
    const newProfile = Object.assign({}, profile, tmpProfile, values, {
      birthday: moment(values.birthday).format('YYYY-MM-DD')
    })

    dispatch(updateProfile(newProfile)).then(() => {
      this.props.dispatch(setProfileProgress())
      this.setState({
        addMode: !this.state.addMode
      })
    })
  }

  getAvailabilityString(value) {
    switch (value) {
      case 0:
        return 'Tillgänglig omgående'
      case 1:
        return 'Inom en månad'
      case 2:
        return 'Inom två månader'
      case 3:
        return 'Inom tre månader'
      case 4:
        return 'Fyra månader eller längre'
      default:
        return 'Okänt'
    }
  }

  render() {
    const {
      isDone,
      profile,
      fetchingProfile,
      updatingProfile,
      errors,
      item
    } = this.props
    const { addMode, tmpProfile } = this.state

    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingProfile}
        fetching={fetchingProfile}
        noForm
        errors={errors}
        closeText="Spara & stäng"
        item={item}
      >
        {!fetchingProfile && (
          <AvForm
            onValidSubmit={this.handleValidSubmit}
            ref={c => {
              this.form = c
            }}
            model={!fetchingProfile ? profile : {}}
            className={cn('editForm', !addMode && 'viewMode')}
          >
            <Row className="profile-content">
              <Col xs={12}>
                <h5 className="section-title">Personuppgifter</h5>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <AvField
                  type="text"
                  name="first_name"
                  label={addMode ? 'Förnamn *' : 'Förnamn'}
                  disabled={!addMode}
                  required
                  errorMessage={{
                    required: 'Förnamn krävs',
                    minLength: 'Minst 2 tecken'
                  }}
                  minLength="2"
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <AvField
                  type="text"
                  name="last_name"
                  label={addMode ? 'Efternamn *' : 'Efternamn'}
                  disabled={!addMode}
                  required
                  errorMessage={{
                    required: 'Efternamn krävs',
                    minLength: 'Minst 2 tecken'
                  }}
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <AvField
                  type="text"
                  name="title"
                  label={addMode ? 'Titel *' : 'Titel'}
                  disabled={!addMode}
                  required
                  errorMessage="Titel krävs"
                  placeholder="Ex. Ekonomiassistent"
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <AvField
                  type="email"
                  name="email"
                  label={addMode ? 'Epost *' : 'Epost'}
                  disabled={!addMode}
                  required
                  errorMessage="Epost krävs"
                  placeholder="Ex. anna@workandpassion.se"
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <AvField
                  type="text"
                  name="mobile_phone_number"
                  label={addMode ? 'Telefon *' : 'Telefon'}
                  disabled={!addMode}
                  required
                  errorMessage={{
                    required: 'Telefon krävs',
                    number: 'Enbart siffror',
                    minLength: 'Minst 7 siffror'
                  }}
                  placeholder="Ex. 0701234567"
                  helpMessage="Enbart siffror, inga mellanslag, prefix eller '-'"
                  validate={{ number: true, minLength: { value: 7 } }}
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <AvField
                  type="date"
                  name="birthday"
                  label={addMode ? 'Födelsedatum *' : 'Födelsedatum'}
                  disabled={!addMode}
                  required
                  helpMessage="Ange ditt födelsedatum YYYY-MM-DD"
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <AvField
                  type="select"
                  name="gender"
                  label="Kön"
                  disabled={!addMode}
                >
                  <option value="female">Kvinna</option>
                  <option value="male">Man</option>
                  <option value="other">Annat / okänt</option>
                </AvField>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5 className="section-title">Adress</h5>
              </Col>
              <Col xs={12} lg={6}>
                <AvField
                  type="text"
                  name="address"
                  required
                  label={addMode ? 'Gatuadress *' : 'Gatuadress'}
                  disabled={!addMode}
                />
                <Row>
                  <Col xs={4}>
                    <AvField
                      type="number"
                      name="zip_code"
                      required
                      label={addMode ? 'Postnummer *' : 'Postnummer'}
                      disabled={!addMode}
                    />
                  </Col>
                  <Col xs={8}>
                    <AvField
                      type="text"
                      name="city"
                      required
                      label={addMode ? 'Postort *' : 'Postort'}
                      disabled={!addMode}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={6} className="d-none d-lg-block">
                <GoogleMap profile={profile} />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <h5 className="section-title">Övrigt</h5>
              </Col>
              <Col xs={12} lg={6}>
                <AvField
                  type="text"
                  name="linkedin_url"
                  label="LinkedIn"
                  disabled={!addMode}
                />
              </Col>
              <Col xs={12} lg={6}>
                <AvField
                  type="text"
                  name="homepage"
                  label="Hemsida"
                  disabled={!addMode}
                  placeholder="Ex. http://workandpassion.se"
                  helpMessage="Måste börja med http:// eller https://"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <label>{addMode ? 'Lönespann *' : 'Lönespann'}</label>
                <Row>
                  <Col xs={6} id="salary_expectations_min">
                    <AvField
                      type="number"
                      name="salary_expectations_min"
                      placeholder="Från"
                      disabled={!addMode}
                      required
                      validate={{ number: true }}
                    />
                  </Col>
                  <Col xs={6}>
                    <AvField
                      type="number"
                      name="salary_expectations_max"
                      placeholder="Till"
                      disabled={!addMode}
                      required
                      validate={{ number: true }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={6}>
                <label>Tillgänglighet</label>
                <Slider
                  disabled={!addMode}
                  min={0}
                  max={4}
                  dots
                  defaultValue={profile.availability}
                  value={tmpProfile.availability}
                  onChange={this.handleAvailabilityChange}
                />
                <div className="value text-center">
                  {this.getAvailabilityString(
                    tmpProfile.availability
                      ? tmpProfile.availability
                      : profile.availability
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Checkbox
                  name="student"
                  label="Student"
                  defaultChecked={profile.student}
                  onChange={this.handleCheckboxChange}
                  disabled={!addMode}
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Checkbox
                  name="actively_searching"
                  label="Aktivt sökande"
                  defaultChecked={profile.actively_searching}
                  onChange={this.handleCheckboxChange}
                  disabled={!addMode}
                />
              </Col>
            </Row>
          </AvForm>
        )}
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.general.done,
  profile: state.profile,
  fetchingProfile: state.profile.fetchingProfile,
  updatingProfile: state.profile.updatingProfile,
  errors: state.profile.profileError
})

export default connect(mapStateToProps)(GeneralCard)

let map, maps
class GoogleMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      center: { lat: 59.334591, lng: 18.06324 },
      zoom: 2
    }

    // this._resizeMapWrapper = this._resizeMapWrapper.bind(this)
  }

  // componentDidMount() {
  //   $(window).on('resize', this._resizeMapWrapper)
  //   this._resizeMapWrapper()
  // }
  //
  // componentWillUnmount() {
  //   $(window).off('resize', this._resizeMapWrapper)
  // }
  //
  // _resizeMapWrapper() {
  //   console.log('resize')
  //   let $mapWrapper = $('#mapWrapper')
  //   $mapWrapper.height($mapWrapper.width() * 0.3)
  //   if (map) {
  //     map.setCenter(this.state.center)
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.profile.address !== this.props.profile.address) {
      const { profile } = this.props
      let newAddress =
        profile.address + ' ' + profile.zip_code + ' ' + profile.city

      this.geoCodeDestination(newAddress)
    }
  }

  geoCodeDestination(address) {
    let _self = this

    if (maps) {
      let geocoder = new maps.Geocoder()
      geocoder.geocode({ address: address }, function(results, status) {
        if (status === maps.GeocoderStatus.OK) {
          _self.setState({
            center: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            zoom: 11
          })
          map.setCenter({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          })
        } else {
          // alert('The address could not be found for the following reason: ' + status)
        }
      })
    }
  }

  setMap(apiMap, apiMaps) {
    let { profile } = this.props
    map = apiMap
    maps = apiMaps
    profile.address &&
      this.geoCodeDestination(
        profile.address + ' ' + profile.zip_code + ' ' + profile.city
      )
  }

  createMapOptions(maps) {
    return {
      gestureHandling: 'greedy',
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [
        {
          stylers: [
            { saturation: -60 },
            { gamma: 0.8 },
            { lightness: 4 },
            { visibility: 'on' }
          ]
        }
      ]
    }
  }

  render() {
    const MarkerComponent = () => (
      <div>
        <i
          className="fa fa-map-marker"
          style={{ fontSize: 30, marginTop: -60, color: '#3fa5c5' }}
        />
      </div>
    )

    return (
      <div id="mapWrapper">
        <GoogleMapReact
          onGoogleApiLoaded={({ map, maps }) => this.setMap(map, maps)}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={{
            key: 'AIzaSyBitEKDDU5IpjCk81W0PP11obSiy68KEVM',
            language: 'en'
          }}
          center={this.state.center}
          defaultZoom={this.state.zoom}
          zoom={this.state.zoom}
          options={this.createMapOptions}
        >
          {this.props.profile.address && (
            <MarkerComponent
              lat={this.state.center.lat}
              lng={this.state.center.lng}
            />
          )}
        </GoogleMapReact>
      </div>
    )
  }
}
