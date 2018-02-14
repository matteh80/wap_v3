import React from 'react'
import { connect } from 'react-redux'
import { fetchEmployments } from '../../../../store/modules/employments'
import ProfileEditableCard from '../ProfileEditableCard'
import { Row, Col, Collapse, Button } from 'reactstrap'
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/min/locales'
import StartEndDate from '../StartEndDate/StartEndDate'
import Select from 'react-select'
import { fetchAllOccupations } from '../../../../store/modules/occupations'
import $ from 'jquery'

class EmploymentsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      employmentsInEditMode: false,
      addMode: false,
      userEmployments: []
    }

    props.dispatch(fetchAllOccupations())

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
    this.addEmployment = this.addEmployment.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    dispatch(fetchEmployments()).then(() => {
      this.setState({
        allLoaded: true,
        userEmployments: this.props.userEmployments
      })
    })
  }

  cbEditMode(editMode) {
    this.setState({
      employmentsInEditMode: editMode
    })
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  addEmployment(employment) {}

  render() {
    let { addMode, employmentsInEditMode } = this.state
    let { updatingEmployments, userEmployments, allOccupations } = this.props
    return (
      <ProfileEditableCard
        id="employments"
        cardTitle="Anställningar"
        cbAddMode={this.cbAddMode}
        loading={updatingEmployments}
      >
        <EmploymentsForm
          isOpen={addMode}
          updateFn={this.addEmployment}
          occupations={allOccupations}
        />
        <div className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || employmentsInEditMode || updatingEmployments) &&
                'active'
            )}
          />
          {userEmployments &&
            userEmployments.map(employment => (
              <EmploymentItem
                employment={employment}
                cbEditMode={this.cbEditMode}
              />
            ))}
        </div>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  userEmployments: state.employments.userEmployments,
  updatingEmployments: state.employments.updatingEmployments,
  allOccupations: state.occupations.allOccupations
})

export default connect(mapStateToProps)(EmploymentsCard)

class EmploymentItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      addMode: false
    }

    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.revertChanges = this.revertChanges.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.editMode !== this.state.editMode) {
      this.props.cbEditMode(this.state.editMode)
    }
  }

  toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  revertChanges() {
    this.setState({
      editMode: false
    })
  }

  getStartEndDate(startDate, endDate, current) {
    moment.locale('sv-SE')
    if (current) {
      return moment(startDate).format('MMM YYYY') + ' - Nuvarande anställning'
    } else {
      return (
        moment(startDate).format('MMM YYYY') +
        ' - ' +
        moment(endDate).format('MMM YYYY')
      )
    }
  }

  render() {
    const { employment } = this.props
    const { start_date, end_date, current } = employment
    const { editMode } = this.state

    return (
      <Row className="employment-item mb-3" style={{ zIndex: editMode && 2 }}>
        <Col xs={12} className="d-flex flex-row">
          <div className="left mr-3">
            <i className="fa fa-briefcase" />
          </div>
          <div className="right d-flex align-items-center w-100">
            <Row>
              <Col xs={12}>
                <h4 className="mb-0">
                  {employment.title} | {employment.employer}
                </h4>
              </Col>
              <Col xs={12}>
                <div className="date-string">
                  {this.getStartEndDate(start_date, end_date, current)}
                </div>
              </Col>
            </Row>
          </div>
          {!editMode && (
            <div className="employment-buttons edit-remove-buttons">
              <div
                className="employment-button edit-remove-button edit"
                onClick={this.toggleEditMode}
              >
                <i className="fa fa-edit ml-1" />
              </div>
              <div
                className="employment-button edit-remove-button"
                onClick={this.removeEmployment}
              >
                <i className="fa fa-trash ml-1" />
              </div>
            </div>
          )}
          {editMode && (
            <div className="employment-buttons edit-remove-buttons--edit-mode edit-remove-buttons">
              <div
                className="employment-button edit-remove-button done"
                onClick={this.updateEmployments}
              >
                <i className="fa fa-check ml-1" />
              </div>
              <div
                className="employment-button edit-remove-button revert"
                onClick={this.revertChanges}
              >
                <i className="fa fa-times ml-1" />
              </div>
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

EmploymentItem.propTypes = {
  employment: PropTypes.object.isRequired
}

class EmploymentsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      employment: {},
      occupationValue: null
    }
  }

  handleDateChange(start_date, end_date, current) {
    this.setState({
      employment: Object.assign({}, this.state.employment, {
        start_date: start_date,
        end_date: end_date,
        current: current
      })
    })
  }

  setUpOccupations() {
    let { occupations } = this.props
    let { userOccupations } = this.props
    let optiondata = []
    let index = -1

    $.each(occupations, function(i, categoryitem) {
      $.each(categoryitem.occupations, function(x, item) {
        optiondata.push({
          label: item.name,
          value: item.id,
          name: item.name,
          id: item.id,
          parent_name: categoryitem.name
        })
      })
    })

    optiondata.sort(function(a, b) {
      if (a.label < b.label) return -1
      if (a.label > b.label) return 1
      return 0
    })

    return optiondata
  }

  render() {
    const { isOpen, cbAddMode } = this.props
    const { occupationValue } = this.state

    return (
      <Collapse isOpen={isOpen}>
        <div className="employments-form mb-3 py-3">
          <AvForm className="row">
            <AvGroup className="col-12 col-md-6">
              <AvField
                type="text"
                name="title"
                label="Position *"
                placeholder="Ex. Talent acquisition manager"
                required
              />
            </AvGroup>
            <AvGroup className="col-12 col-md-6">
              <AvField
                type="text"
                name="employer"
                label="Företag *"
                placeholder="Ex. Workandpassion"
                required
              />
            </AvGroup>
            <AvGroup className="col-12 col-md-6">
              <label>Befattning *</label>
              <Select
                name="form-field-name"
                simpleValue
                value={occupationValue}
                onChange={value => this.setState({ occupationValue: value })}
                options={this.setUpOccupations()}
                placeholder="Välj en befattning"
              />
            </AvGroup>
            <StartEndDate withCurrent onChange={this.handleDateChange} />
            <Col xs={12}>
              <Button>Lägg till</Button>
            </Col>
          </AvForm>
        </div>
      </Collapse>
    )
  }
}
