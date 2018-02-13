import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import {
  editUserSkills,
  fetchAllSkills,
  fetchUserSkills
} from '../../../../store/modules/skills'
import Slider, { Handle } from 'rc-slider'
import { Row, Col, Collapse, Button } from 'reactstrap'
import Select from 'react-select'
import $ from 'jquery'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import update from 'immutability-helper'
import _ from 'lodash'

class SkillsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      skillsInEditMode: false,
      addMode: false,
      userSkills: []
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
    this.updateSkills = this.updateSkills.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    Promise.all([dispatch(fetchUserSkills()), dispatch(fetchAllSkills())]).then(
      () => {
        this.setState({
          allLoaded: true,
          userSkills: this.props.userSkills
        })
      }
    )
  }

  cbEditMode(editMode) {
    this.setState({
      skillsInEditMode: editMode
    })
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  updateSkills(skills) {
    let { dispatch } = this.props

    dispatch(editUserSkills(skills))
  }

  render() {
    const { userSkills, allSkills, updatingUserSkills } = this.props
    const { allLoaded, addMode, skillsInEditMode } = this.state
    return (
      <ProfileEditableCard
        id="skills"
        cardTitle="Kompetenser"
        cbAddMode={this.cbAddMode}
        loading={updatingUserSkills}
      >
        {allLoaded && (
          <SkillsForm
            skills={allSkills}
            userSkills={userSkills}
            isOpen={addMode}
            updateFn={this.updateSkills}
          />
        )}
        <Row className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || skillsInEditMode || updatingUserSkills) && 'active'
            )}
          />
          {userSkills &&
            userSkills.map(userSkill => (
              <SkillsSlider
                key={userSkill.id}
                name={userSkill.name}
                experience={userSkill.experience}
                userSkill={userSkill}
                userSkills={userSkills}
                cbEditMode={this.cbEditMode}
                updateFn={this.updateSkills}
              />
            ))}
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  userSkills: state.skills.userSkills,
  allSkills: state.skills.allSkills,
  updatingUserSkills: state.skills.updatingUserSkills
})

export default connect(mapStateToProps)(SkillsCard)

class SkillsSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.experience,
      editMode: false,
      addMode: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.updateSkills = this.updateSkills.bind(this)
    this.removeSkill = this.removeSkill.bind(this)
    this.revertChanges = this.revertChanges.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.editMode !== this.state.editMode) {
      this.props.cbEditMode(this.state.editMode)
    }
  }

  handleChange(value) {
    this.state.editMode &&
      this.setState({
        value: value
      })
  }

  toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  updateSkills() {
    this.setState({
      editMode: false
    })

    let { userSkills, userSkill } = this.props
    let { value } = this.state

    let index = _.findIndex(userSkills, { id: userSkill.id })
    let newSkills = Object.assign([], userSkills)
    newSkills[index].experience = value

    this.props.updateFn(newSkills)
  }

  removeSkill() {
    this.setState({
      editMode: false
    })

    let { userSkills, userSkill } = this.props

    let newSkills = _.filter(userSkills, function(skill) {
      return skill.id !== userSkill.id
    })

    this.props.updateFn(newSkills)
  }

  revertChanges() {
    this.setState({
      editMode: false,
      value: this.props.experience
    })
  }

  render() {
    let { value, editMode } = this.state
    let { name, experience } = this.props

    return (
      <Col
        xs={12}
        md={6}
        className="skill-wrapper"
        style={{ zIndex: editMode && 2 }}
      >
        <h5 className="mb-0">{name}</h5>
        <div className="d-flex flex-row">
          <div className="skills-slider">
            <Slider
              min={1}
              max={5}
              handle={handle}
              dots
              value={value}
              onChange={value => this.handleChange(value)}
              disabled={!editMode}
              className="mr-4"
            />
            <div className="value text-center">{getSkillString(value)}</div>
          </div>
          {!editMode && (
            <div className="skill-buttons edit-remove-buttons">
              <div
                className="skill-button edit-remove-button edit"
                onClick={this.toggleEditMode}
              >
                <i className="fa fa-edit ml-1" />
              </div>
              <div
                className="skill-button edit-remove-button"
                onClick={this.removeSkill}
              >
                <i className="fa fa-trash ml-1" />
              </div>
            </div>
          )}
          {editMode && (
            <div className="skill-buttons edit-remove-buttons--edit-mode edit-remove-buttons">
              <div
                className="skill-button edit-remove-button done"
                onClick={this.updateSkills}
              >
                <i className="fa fa-check ml-1" />
              </div>
              <div
                className="skill-button edit-remove-button revert"
                onClick={this.revertChanges}
              >
                <i className="fa fa-times ml-1" />
              </div>
            </div>
          )}
        </div>
      </Col>
    )
  }
}

SkillsSlider.propTypes = {
  updateFn: PropTypes.func.isRequired
}

class SkillsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      skills: this.setUpSkills(),
      value: undefined,
      experience: 1,
      options: []
    }

    this.setUpSkills = this.setUpSkills.bind(this)
    this.addSkill = this.addSkill.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userSkills !== this.props.userSkills) {
      this.setState({
        skills: this.setUpSkills(),
        value: undefined
      })
    }
  }

  setUpSkills() {
    let { skills } = this.props
    let { userSkills } = this.props
    let optiondata = []
    let index = -1

    $.each(skills, function(i, categoryitem) {
      $.each(categoryitem.skills, function(x, item) {
        index = userSkills.findIndex(userSkills => userSkills.id === item.id)
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

  addSkill() {
    let { updateFn, userSkills } = this.props
    let { value, experience } = this.state
    let skillToAdd = {
      id: value,
      experience: experience
    }

    let newSkills = update(userSkills, { $push: [skillToAdd] })

    updateFn(newSkills)
  }

  render() {
    let { value, skills, experience, options } = this.state
    const { isOpen, cbAddMode } = this.props
    const inputProps = {
      placeholder: 'Skriv in en kompetens',
      value,
      onChange: this.onChange
    }

    return (
      <Collapse isOpen={isOpen}>
        <div className="skills-form mb-3 py-3">
          <Row>
            <Col xs={12} md={6}>
              <Select
                name="form-field-name"
                simpleValue
                value={value}
                onChange={value => this.setState({ value: value })}
                options={skills}
                placeholder="Välj en kompetens"
              />
            </Col>
            <Col xs={12} md={6}>
              <div className="skill-slider">
                <Slider
                  min={1}
                  max={5}
                  handle={handle}
                  dots
                  value={experience}
                  onChange={value => this.setState({ experience: value })}
                  className="mr-4"
                />
                <div className="value text-center">
                  {getSkillString(experience)}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <Button
                className="mr-3"
                disabled={!value}
                onClick={this.addSkill}
              >
                Lägg till kompetens
              </Button>
            </Col>
          </Row>
        </div>
      </Collapse>
    )
  }
}

SkillsForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  updateFn: PropTypes.func.isRequired
}

const handle = props => {
  const { value, dragging, index, ...restProps } = props
  return (
    <Handle value={value} {...restProps}>
      {/*{dragging && <span style={{ color: '#fff' }}>{value}</span>}*/}
    </Handle>
  )
}

const getSkillString = value => {
  switch (value) {
    case 1:
      return 'Inga kunskaper'
    case 2:
      return 'Grundläggande kunskaper'
    case 3:
      return 'Goda kunskaper'
    case 4:
      return 'Mycket goda kunskaper'
    case 5:
      return 'Expert'
    default:
      return '-'
  }
}
