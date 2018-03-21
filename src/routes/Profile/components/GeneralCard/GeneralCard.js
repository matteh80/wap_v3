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
import $ from 'jquery'
import Checkbox from '../../../../components/Checkbox/Checkbox'
// import Slider, { Range } from 'rc-slider'

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
  }

  componentDidMount() {
    let { dispatch } = this.props

    Promise.all([dispatch(fetchProfile())])
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
        [name]: !this.state.tmpProfile[name]
      }
    })
  }

  handleValidSubmit(event, values) {
    const { dispatch, profile } = this.props
    const { tmpProfile } = this.state
    const newProfile = Object.assign({}, profile, tmpProfile, values)
    dispatch(updateProfile(newProfile)).then(() => {
      this.props.dispatch(setProfileProgress())
      this.setState({
        addMode: !this.state.addMode
      })
    })
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
    const { addMode } = this.state

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
                label="Förnamn *"
                disabled={!addMode}
                required
                errorMessage="Förnamn krävs"
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <AvField
                type="text"
                name="last_name"
                label="Efternamn *"
                disabled={!addMode}
                required
                errorMessage="Efternamn krävs"
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
                placeHolder="Ex. Ekonomiassistent"
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <AvField
                type="email"
                name="email"
                label="Epost *"
                disabled={!addMode}
                required
                errorMessage="Epost krävs"
                placeHolder="Ex. anna@workandpassion.se"
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <AvField
                type="text"
                name="mobile_phone_number"
                label="Telefon *"
                disabled={!addMode}
                required
                errorMessage="Telefon krävs"
                placeHolder="Ex. 0701234567"
                helpMessage="Enbart siffror, inga mellanslag, prefix eller '-'"
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <AvField
                type="date"
                name="birthday"
                label="Födelsedatum"
                disabled={!addMode}
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
                <option value="male">Annat / okänt</option>
              </AvField>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <label>Lönespann</label>
              <Row>
                <Col xs={6} id="salary_expectations_min">
                  <AvField
                    type="number"
                    name="salary_expectations_min"
                    disabled={!addMode}
                  />
                </Col>
                <Col xs={6}>
                  <AvField
                    type="number"
                    name="salary_expectations_max"
                    disabled={!addMode}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h5 className="section-title">Adress</h5>
            </Col>
            <Col xs={12} md={6}>
              <AvField
                type="text"
                name="address"
                label="Gatuadress"
                disabled={!addMode}
              />
              <Row>
                <Col xs={4}>
                  <AvField
                    type="number"
                    name="zip_code"
                    label="Postnummer"
                    disabled={!addMode}
                  />
                </Col>
                <Col xs={8}>
                  <AvField
                    type="text"
                    name="city"
                    label="Postort"
                    disabled={!addMode}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={6} className="d-none d-md-block">
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
                placeHolder="Ex. http://workandpassion.se"
                helpMessage="Måste börja med http:// eller https://"
              />
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
