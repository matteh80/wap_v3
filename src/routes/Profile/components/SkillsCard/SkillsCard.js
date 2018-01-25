import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import {
  fetchAllSkills,
  fetchUserSkills
} from '../../../../store/modules/skills'
import Slider, { Handle } from 'rc-slider'
import { Row, Col, Collapse, Button } from 'reactstrap'
import Select from 'react-select'
import $ from 'jquery'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class SkillsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      skillsInEditMode: false,
      addMode: false
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    Promise.all([dispatch(fetchUserSkills()), dispatch(fetchAllSkills())]).then(
      () => {
        this.setState({
          allLoaded: true
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

  render() {
    const { userSkills, allSkills } = this.props
    const { allLoaded, addMode, skillsInEditMode } = this.state
    return (
      <ProfileEditableCard cardTitle="Kompetenser" cbAddMode={this.cbAddMode}>
        {allLoaded && (
          <SkillsForm
            skills={allSkills}
            userSkills={userSkills}
            isOpen={addMode}
          />
        )}
        <Row className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || skillsInEditMode) && 'active'
            )}
          />
          {userSkills &&
            userSkills.map(userSkill => (
              <SkillsSlider
                key={userSkill.id}
                name={userSkill.name}
                experience={userSkill.experience}
                cbEditMode={this.cbEditMode}
              />
            ))}
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  userSkills: state.skills.userSkills,
  allSkills: state.skills.allSkills
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
            <div className="skill-buttons">
              <div className="skill-button edit" onClick={this.toggleEditMode}>
                <i className="fa fa-edit ml-1" />
              </div>
              <div className="skill-button">
                <i className="fa fa-trash ml-1" />
              </div>
            </div>
          )}
          {editMode && (
            <div className="skill-buttons skill-buttons--edit-mode">
              <div className="skill-button done" onClick={this.toggleEditMode}>
                <i className="fa fa-check ml-1" />
              </div>
              <div className="skill-button revert">
                <i className="fa fa-times ml-1" />
              </div>
            </div>
          )}
        </div>
      </Col>
    )
  }
}

class SkillsForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      skills: this.setUpSkills(),
      value: undefined,
      experience: 1
    }

    this.setUpSkills = this.setUpSkills.bind(this)
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

  render() {
    let { value, skills, experience } = this.state
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
                value={value}
                simpleValue
                onChange={value => this.setState({ value: value })}
                options={skills}
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
              <Button className="mr-3">Lägg till kompetens</Button>
            </Col>
          </Row>
        </div>
      </Collapse>
    )
  }
}

SkillsForm.propTypes = {
  isOpen: PropTypes.bool.isRequired
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
