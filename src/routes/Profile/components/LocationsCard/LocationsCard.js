import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import {
  editUserLocations,
  fetchAllLocations,
  fetchUserLocations
} from '../../../../store/modules/locations'
import { Row, Col, Collapse, Button, Badge } from 'reactstrap'
import Select from 'react-select'
import $ from 'jquery'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import update from 'immutability-helper'
import _ from 'lodash'

class LocationsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      locationsInEditMode: false,
      addMode: false
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
    this.updateLocations = this.updateLocations.bind(this)
    this.renderLocations = this.renderLocations.bind(this)
    this.removeLocation = this.removeLocation.bind(this)

    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    let { dispatch } = this.props

    Promise.all([dispatch(fetchUserLocations()), dispatch(fetchAllLocations())])
  }

  cbEditMode(editMode) {
    this.setState({
      locationsInEditMode: editMode
    })
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  updateLocations(locations) {
    let { dispatch } = this.props

    dispatch(editUserLocations(locations))
  }

  removeLocation(location) {
    const { userLocations } = this.props
    const newLocations = _.filter(userLocations, item => {
      return item.id !== location.id
    })

    this.updateLocations(newLocations)
  }

  renderLocations() {
    const _this = this
    const { userLocations } = this.props
    const locationsByParent = _.groupBy(userLocations, 'parent_name')
    let renderData = []

    Object.keys(locationsByParent).forEach(function(key) {
      renderData.push(<h5 key={key}>{key}</h5>)
      locationsByParent[key].forEach(item => {
        renderData.push(
          <Badge key={item.id} pill color="primary">
            {item.name}
            <div
              className="remove-location ml-1"
              onClick={() => _this.removeLocation(item)}
            >
              <i className="fas fa-times-circle" />
            </div>
          </Badge>
        )
      })
    })
    return renderData
  }

  render() {
    const {
      item,
      isDone,
      userLocations,
      allLocations,
      updatingUserLocations,
      fetchingUserLocations
    } = this.props
    const { addMode, locationsInEditMode } = this.state
    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingUserLocations}
        fetching={fetchingUserLocations}
        item={item}
      >
        {userLocations &&
          allLocations &&
          !fetchingUserLocations && (
            <LocationsForm
              locations={allLocations}
              userLocations={userLocations}
              isOpen={addMode}
              updateFn={this.updateLocations}
            />
          )}
        <Row className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || locationsInEditMode || updatingUserLocations) &&
                'active'
            )}
          />
          <Col xs={12}>{userLocations && this.renderLocations()}</Col>
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.locations.done,
  userLocations: state.locations.userLocations,
  allLocations: state.locations.allLocations,
  updatingUserLocations: state.locations.updatingUserLocations,
  fetchingUserLocations: state.locations.fetchingUserLocations
})

export default connect(mapStateToProps)(LocationsCard)

class LocationsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      locations: this.setUpLocations(),
      parentValue: undefined,
      value: undefined,
      options: []
    }

    this.setUpLocations = this.setUpLocations.bind(this)
    this.addLocation = this.addLocation.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userLocations !== this.props.userLocations) {
      this.setState({
        locations: this.setUpLocations(),
        value: undefined
      })
    }
  }

  setUpLocations() {
    let { locations } = this.props
    let { userLocations } = this.props
    let optiondata = []
    let index = -1

    $.each(locations, function(x, item) {
      index = _.findIndex(userLocations, { id: item.id })
      if (index === -1) {
        optiondata.push({
          label: item.name,
          value: item.id,
          name: item.name,
          id: item.id
        })
      }
    })

    optiondata.sort(function(a, b) {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })

    return optiondata
  }

  addLocation() {
    let { updateFn, userLocations } = this.props
    let { value } = this.state
    let locationToAdd = {
      id: value
    }

    let newLocations = update(userLocations, { $push: value })

    updateFn(newLocations)
  }

  render() {
    let { parentValue, value, locations } = this.state
    const { isOpen } = this.props

    return (
      <Collapse isOpen={isOpen}>
        <div className="locations-form mb-3 py-3">
          <Row>
            <Col xs={12} md={6}>
              <Select
                name="parentlocation"
                value={parentValue}
                onChange={value => this.setState({ parentValue: value })}
                options={this.props.locations}
                valueKey={'id'}
                labelKey={'name'}
                placeholder="Välj ett län"
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                name="locations"
                multi
                value={value}
                onChange={value => this.setState({ value: value })}
                options={parentValue && parentValue.municipalities}
                valueKey={'id'}
                labelKey={'name'}
                placeholder={
                  parentValue
                    ? `Välj önskade arbetsorter i ${parentValue.name}`
                    : 'Välj län först'
                }
                disabled={!parentValue}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <Button
                className="mr-3"
                disabled={!value}
                onClick={this.addLocation}
              >
                Lägg till
              </Button>
            </Col>
          </Row>
        </div>
      </Collapse>
    )
  }
}

LocationsForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  updateFn: PropTypes.func.isRequired
}
