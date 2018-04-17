import React from 'react'
import { connect } from 'react-redux'
import {
  createEmployment,
  fetchEmployments,
  removeEmployment,
  updateEmployment
} from '../../../../store/modules/employments'
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
      addMode: false
    }

    props.dispatch(fetchAllOccupations())

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    dispatch(fetchEmployments())
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

  render() {
    const { addMode, employmentsInEditMode } = this.state
    const {
      item,
      dispatch,
      isDone,
      updatingEmployments,
      fetchingEmployments,
      userEmployments,
      allOccupations
    } = this.props
    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingEmployments}
        fetching={fetchingEmployments}
        inEditMode={employmentsInEditMode}
        item={item}
      >
        <EmploymentsForm
          isOpen={addMode}
          occupations={allOccupations}
          dispatch={dispatch}
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
                key={employment.id}
                employment={employment}
                cbEditMode={this.cbEditMode}
                occupations={allOccupations}
                dispatch={dispatch}
              />
            ))}
        </div>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.employments.done,
  userEmployments: state.employments.userEmployments,
  updatingEmployments: state.employments.updatingEmployments,
  fetchingEmployments: state.employments.fetchingEmployments,
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
    this.remove = this.remove.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.editMode !== this.state.editMode) {
      this.props.cbEditMode(this.state.editMode)
    }

    if (prevProps.employment !== this.props.employment && this.state.editMode) {
      this.toggleEditMode()
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

  remove() {
    const { dispatch, employment } = this.props
    dispatch(removeEmployment(employment))
  }

  render() {
    const { employment, occupations, dispatch } = this.props
    const { editMode } = this.state
    const { start_date, end_date, current } = employment

    return (
      <Row
        className={classnames('employment-item mb-3', editMode && 'editMode')}
        style={{ zIndex: editMode && 2 }}
      >
        <Col xs={12} className="d-flex flex-row">
          <div className="left mr-3 d-none d-md-block">
            <div className={classnames('employment-icon', editMode && 'edit')}>
              <i
                className={classnames(
                  editMode ? 'fas fa-pencil-alt' : 'fas fa-briefcase'
                )}
              />
            </div>
          </div>
          <div className="right d-flex align-items-center w-100">
            <Row className="w-100 flex-column">
              <Col xs={12}>
                <h4 className="mb-0 employment-title">
                  {employment.title} ({employment.employer})
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
                onClick={this.remove}
              >
                <i className="fa fa-trash ml-1" />
              </div>
            </div>
          )}
        </Col>
        <Col xs={12}>
          <EmploymentsForm
            employment={employment}
            isOpen={editMode}
            cbRevert={this.revertChanges}
            occupations={occupations}
            dispatch={dispatch}
          />
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
      employment: props.employment ? props.employment : { description: null },
      occupationValue: props.employment && props.employment.occupation,
      editMode: !!props.employment
    }

    this.abort = this.abort.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOccupationChange = this.handleOccupationChange.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.employment !== this.props.employment) {
      this.setState({
        employment: this.props.employment
      })
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
    let optiondata = []

    $.each(occupations, function(i, categoryitem) {
      $.each(categoryitem.occupations, function(x, item) {
        optiondata.push({
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

  abort(e) {
    e.preventDefault()

    this.props.cbRevert()
  }

  handleOccupationChange(value) {
    this.setState({
      occupationValue: value,
      employment: {
        ...this.state.employment,
        occupation: value
      }
    })
  }

  handleSubmit(event, values) {
    const { dispatch } = this.props
    const employment = Object.assign({}, this.state.employment, values, {
      current: values.current === 'true',
      start_date: values.start_date
        ? values.start_date
        : moment().format('YYYY-MM-DD'),
      end_date: values.end_date
        ? values.end_date
        : moment().format('YYYY-MM-DD')
    })

    this.state.editMode
      ? dispatch(updateEmployment(employment))
      : dispatch(createEmployment(employment))

    this.form && this.form.reset()
  }

  render() {
    const { isOpen } = this.props
    const { occupationValue, employment } = this.state
    const defaultDateValues = employment
      ? [employment.start_date, employment.end_date, employment.current]
      : null

    return (
      <Collapse isOpen={isOpen}>
        <div className="employments-form mb-3 py-3">
          {isOpen && (
            <AvForm
              onValidSubmit={this.handleSubmit}
              className="row"
              model={employment ? employment : null}
              ref={c => (this.form = c)}
            >
              <Col xs={12} sm={6}>
                <AvField
                  type="text"
                  name="title"
                  label="Position *"
                  placeholder="Ex. Talent acquisition manager"
                  errorMessage="Detta fält krävs"
                  required
                />
              </Col>
              <Col xs={12} sm={6}>
                <AvField
                  type="text"
                  name="employer"
                  label="Företag *"
                  placeholder="Ex. Workandpassion"
                  errorMessage="Detta fält krävs"
                  required
                />
              </Col>
              <AvGroup className="col-12 col-md-6">
                <label>Befattning *</label>
                <Select
                  name="form-field-name"
                  simpleValue
                  valueKey={'id'}
                  labelKey={'name'}
                  value={occupationValue}
                  onChange={this.handleOccupationChange}
                  options={this.setUpOccupations()}
                  placeholder="Välj en befattning"
                  clearable={false}
                />
                <AvField
                  type="hidden"
                  name="occupation"
                  value={occupationValue}
                  errorMessage="Detta fält krävs"
                  required
                />
              </AvGroup>
              <StartEndDate
                withCurrent
                onChange={this.handleDateChange}
                defaultValues={defaultDateValues}
              />
              <Col xs={12} dm={6}>
                <AvField
                  name="description"
                  type="textarea"
                  label="Beskrivning"
                />
              </Col>
              <Col xs={12}>
                <Button type="submit">
                  {this.state.editMode ? 'Uppdatera' : 'Lägg till'}
                </Button>
                {this.state.editMode && (
                  <Button className="ml-3" color="primary" onClick={this.abort}>
                    Avbryt
                  </Button>
                )}
              </Col>
            </AvForm>
          )}
        </div>
      </Collapse>
    )
  }
}

EmploymentsForm.propTypes = {
  employment: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}
