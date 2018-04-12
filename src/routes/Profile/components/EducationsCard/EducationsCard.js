import React from 'react'
import { connect } from 'react-redux'
import {
  createEducation,
  fetchEducations,
  removeEducation,
  updateEducation
} from '../../../../store/modules/educations'
import ProfileEditableCard from '../ProfileEditableCard'
import { Row, Col, Collapse, Button } from 'reactstrap'
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/min/locales'
import StartEndDate from '../StartEndDate/StartEndDate'
import $ from 'jquery'

class EducationsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      educationsInEditMode: false,
      addMode: false
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    dispatch(fetchEducations())
  }

  cbEditMode(editMode) {
    this.setState({
      educationsInEditMode: editMode
    })
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  render() {
    const { addMode, educationsInEditMode } = this.state
    const {
      item,
      dispatch,
      isDone,
      updatingEducations,
      fetchingEducations,
      userEducations,
      allOccupations
    } = this.props
    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingEducations}
        fetching={fetchingEducations}
        inEditMode={educationsInEditMode}
        item={item}
      >
        <EducationsForm
          isOpen={addMode}
          occupations={allOccupations}
          dispatch={dispatch}
        />
        <div className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || educationsInEditMode || updatingEducations) &&
                'active'
            )}
          />
          {userEducations &&
            userEducations.map(education => (
              <EducationItem
                key={education.id}
                education={education}
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
  isDone: state.profile.progress.items.educations.done,
  userEducations: state.educations.userEducations,
  updatingEducations: state.educations.updatingEducations,
  fetchingEducations: state.educations.fetchingEducations,
  allOccupations: state.occupations.allOccupations
})

export default connect(mapStateToProps)(EducationsCard)

class EducationItem extends React.Component {
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

    if (prevProps.education !== this.props.education && this.state.editMode) {
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
    const { dispatch, education } = this.props
    dispatch(removeEducation(education))
  }

  render() {
    const { education, occupations, dispatch } = this.props
    const { editMode } = this.state
    const { start_date, end_date, current } = education

    return (
      <Row
        className={classnames('education-item mb-3', editMode && 'editMode')}
        style={{ zIndex: editMode && 2 }}
      >
        <Col xs={12} className="d-flex flex-row">
          <div className="left mr-3">
            <div className={classnames('education-icon', editMode && 'edit')}>
              <i
                className={classnames(
                  editMode ? 'fas fa-pencil-alt' : 'fas fa-graduation-cap'
                )}
              />
            </div>
          </div>
          <div className="right d-flex align-items-center w-100">
            <Row>
              <Col xs={12}>
                <h4 className="mb-0">
                  {education.orientation} ({education.school})
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
            <div className="education-buttons edit-remove-buttons">
              <div
                className="education-button edit-remove-button edit"
                onClick={this.toggleEditMode}
              >
                <i className="fa fa-edit ml-1" />
              </div>
              <div
                className="education-button edit-remove-button"
                onClick={this.remove}
              >
                <i className="fa fa-trash ml-1" />
              </div>
            </div>
          )}
        </Col>
        <Col xs={12}>
          <EducationsForm
            education={education}
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

EducationItem.propTypes = {
  education: PropTypes.object.isRequired
}

class EducationsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      education: props.education ? props.education : { description: null },
      occupationValue: props.education && props.education.occupation,
      editMode: !!props.education
    }

    this.abort = this.abort.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.education !== this.props.education) {
      this.setState({
        education: this.props.education
      })
    }
  }

  handleDateChange(start_date, end_date, current) {
    this.setState({
      education: Object.assign({}, this.state.education, {
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

  abort(e) {
    e.preventDefault()

    this.props.cbRevert()
  }

  handleSubmit(event, values) {
    const { dispatch } = this.props
    const education = Object.assign({}, this.state.education, values)

    this.state.editMode
      ? dispatch(updateEducation(education))
      : dispatch(createEducation(education))

    this.form && this.form.reset()
    this.setState({
      occupationValue: null
    })
  }

  render() {
    const { isOpen } = this.props
    const { education } = this.state
    const defaultDateValues = education
      ? [education.start_date, education.end_date, education.current]
      : null

    return (
      <Collapse isOpen={isOpen}>
        <div className="educations-form mb-3 py-3">
          {isOpen && (
            <AvForm
              onValidSubmit={this.handleSubmit}
              className="row"
              model={education ? education : null}
              ref={c => (this.form = c)}
            >
              <Col xs={12} sm={6}>
                <AvField type="select" name="type" label="Typ av skola">
                  <option value="university">Högskola / Universitet</option>
                  <option value="vocational">YH / Övrig utbildning</option>
                  <option value="single_courses">Enstaka kurser</option>
                  <option value="high_school">Gymnasium</option>
                </AvField>
              </Col>
              <Col xs={12} sm={6}>
                <AvField
                  type="text"
                  name="orientation"
                  label="Inriktning *"
                  placeholder="Ex. Java-programmering A"
                  errorMessage="Detta fält krävs"
                  required
                />
              </Col>
              <Col xs={12} sm={6}>
                <AvField
                  type="text"
                  name="school"
                  label="Skola *"
                  placeholder="Ex. KTH"
                  errorMessage="Detta fält krävs"
                  required
                />
              </Col>
              <StartEndDate
                onChange={this.handleDateChange}
                defaultValues={defaultDateValues}
              />
              {this.props.education && (
                <Col xs={12}>
                  <AvField
                    name="description"
                    type="textarea"
                    label="Beskrivning"
                  />
                </Col>
              )}
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

EducationsForm.propTypes = {
  education: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}
