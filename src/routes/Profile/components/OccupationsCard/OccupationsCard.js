import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import {
  editUserOccupations,
  fetchAllOccupations,
  fetchUserOccupations
} from '../../../../store/modules/occupations'
import Slider, { Handle } from 'rc-slider'
import {
  Row,
  Col,
  Collapse,
  Button,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap'
import Select from 'react-select'
import $ from 'jquery'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import update from 'immutability-helper'
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle
} from 'react-sortable-hoc'

class OccupationsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      occupationsInEditMode: false,
      addMode: false,
      userOccupations: []
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
    this.updateOccupations = this.updateOccupations.bind(this)
    this.removeOccupation = this.removeOccupation.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    Promise.all([
      dispatch(fetchUserOccupations()),
      dispatch(fetchAllOccupations())
    ]).then(() => {
      this.setState({
        allLoaded: true,
        userOccupations: this.props.userOccupations
      })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userOccupations !== this.props.userOccupations) {
      this.setState({
        userOccupations: this.props.userOccupations
      })
    }
  }

  cbEditMode(editMode) {
    this.setState({
      occupationsInEditMode: editMode
    })
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  updateOccupations(occupations) {
    let { dispatch } = this.props

    dispatch(editUserOccupations(occupations))
  }

  removeOccupation(index) {
    let newOccupations = Object.assign([], this.state.userOccupations)
    newOccupations.splice(index, 1)

    this.updateOccupations(newOccupations)
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      let newOccupations = arrayMove(
        this.state.userOccupations,
        oldIndex,
        newIndex
      )

      this.setState({
        userOccupations: newOccupations
      })

      this.updateOccupations(newOccupations)
    }
  }

  render() {
    const {
      isDone,
      allOccupations,
      updatingUserOccupations,
      fetchingUserOccupations
    } = this.props
    const {
      allLoaded,
      addMode,
      occupationsInEditMode,
      userOccupations
    } = this.state

    const DragHandle = SortableHandle(({ mIndex }) => (
      <div className="index">
        <span className="index-number">{mIndex + 1}</span>
        <i className="fa fa-arrows-alt moving-icon" />
      </div>
    ))

    const SortableItem = SortableElement(({ value, index, mIndex }) => (
      <div className="occupation-item col-12 col-md-4 d-flex flex-row align-items-center">
        <DragHandle mIndex={mIndex} />
        <h5>{value.name}</h5>
        <div
          className="remove-icon"
          onClick={() => this.removeOccupation(index)}
        >
          <i className="fa fa-trash ml-1" />
        </div>
      </div>
    ))

    const SortableList = SortableContainer(({ items }) => {
      return (
        <div className="occupation-list">
          {items.map((value, index) => (
            <SortableItem
              key={`item-${index}`}
              index={index}
              mIndex={index}
              value={value}
            />
          ))}
        </div>
      )
    })

    return (
      <ProfileEditableCard
        id="occupations"
        cardTitle="Befattningar"
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingUserOccupations}
        fetching={fetchingUserOccupations}
        isDone={isDone}
      >
        {allLoaded && (
          <OccupationsForm
            occupations={allOccupations}
            userOccupations={userOccupations}
            isOpen={addMode}
            updateFn={this.updateOccupations}
          />
        )}
        <Row className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || occupationsInEditMode || updatingUserOccupations) &&
                'active'
            )}
          />
          <Col xs={12}>
            <SortableList
              axis={'xy'}
              useDragHandle
              items={userOccupations}
              onSortEnd={this.onSortEnd}
              helperClass="moving-occupation"
            />
          </Col>
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.occupations.done,
  userOccupations: state.occupations.userOccupations,
  allOccupations: state.occupations.allOccupations,
  updatingUserOccupations: state.occupations.updatingUserOccupations,
  fetchUserOccupations: state.occupations.fetc
})

export default connect(mapStateToProps)(OccupationsCard)

class OccupationsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      occupations: this.setUpOccupations(),
      value: undefined,
      experience: 1,
      options: []
    }

    this.setUpOccupations = this.setUpOccupations.bind(this)
    this.addOccupation = this.addOccupation.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userOccupations !== this.props.userOccupations) {
      this.setState({
        occupations: this.setUpOccupations(),
        value: undefined
      })
    }
  }

  setUpOccupations() {
    let { occupations } = this.props
    let { userOccupations } = this.props
    let optiondata = []
    let index = -1

    $.each(occupations, function(i, categoryitem) {
      $.each(categoryitem.occupations, function(x, item) {
        index = userOccupations.findIndex(
          userOccupations => userOccupations.id === item.id
        )
        if (index === -1) {
          optiondata.push({
            label: item.name,
            value: item.id,
            name: item.name,
            id: item.id,
            parent_name: categoryitem.name
          })
        }
      })
    })

    optiondata.sort(function(a, b) {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })

    return optiondata
  }

  addOccupation() {
    let { updateFn, userOccupations } = this.props
    let { value, experience } = this.state
    let occupationToAdd = {
      id: value,
      experience: experience
    }

    let newOccupations = update(userOccupations, { $push: [occupationToAdd] })

    updateFn(newOccupations)
  }

  render() {
    let { value, occupations, experience, options } = this.state
    const { isOpen, cbAddMode } = this.props

    return (
      <Collapse isOpen={isOpen}>
        <div className="occupations-form mb-3 py-3">
          <Row>
            <Col xs={12} md={6}>
              <Select
                name="form-field-name"
                simpleValue
                value={value}
                onChange={value => this.setState({ value: value })}
                options={occupations}
                placeholder="Välj en befattning"
              />
            </Col>
            <Col xs={12} md={6}>
              <Button
                className="mr-3"
                disabled={!value}
                onClick={this.addOccupation}
              >
                Lägg till befattning
              </Button>
            </Col>
          </Row>
        </div>
      </Collapse>
    )
  }
}

OccupationsForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  updateFn: PropTypes.func.isRequired
}
