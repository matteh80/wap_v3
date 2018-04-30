import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import {
  editUserLanguages,
  fetchAllLanguages,
  fetchUserLanguages
} from '../../../../store/modules/languages'
import Slider, { Handle } from 'rc-slider'
import { Row, Col, Collapse, Button } from 'reactstrap'
import Select from 'react-select'
import $ from 'jquery'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import update from 'immutability-helper'
import _ from 'lodash'

class LanguagesCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      languagesInEditMode: false,
      addMode: false
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
    this.updateLanguages = this.updateLanguages.bind(this)

    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    let { dispatch } = this.props

    Promise.all([dispatch(fetchUserLanguages()), dispatch(fetchAllLanguages())])
  }

  cbEditMode(editMode) {
    this.setState({
      languagesInEditMode: editMode
    })
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  updateLanguages(languages) {
    let { dispatch } = this.props

    dispatch(editUserLanguages(languages))
  }

  render() {
    const {
      item,
      isDone,
      userLanguages,
      allLanguages,
      updatingUserLanguages,
      fetchingUserLanguages
    } = this.props
    const { addMode, languagesInEditMode } = this.state
    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingUserLanguages}
        fetching={fetchingUserLanguages}
        item={item}
      >
        {userLanguages &&
          allLanguages &&
          !fetchingUserLanguages && (
            <LanguagesForm
              languages={allLanguages}
              userLanguages={userLanguages}
              isOpen={addMode}
              updateFn={this.updateLanguages}
            />
          )}
        <Row className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || languagesInEditMode || updatingUserLanguages) &&
                'active'
            )}
          />
          {userLanguages &&
            userLanguages.map(userLanguage => (
              <LanguagesSlider
                key={userLanguage.id}
                name={userLanguage.name}
                userLanguage={userLanguage}
                userLanguages={userLanguages}
                cbEditMode={this.cbEditMode}
                updateFn={this.updateLanguages}
              />
            ))}
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.languages.done,
  userLanguages: state.languages.userLanguages,
  allLanguages: state.languages.allLanguages,
  updatingUserLanguages: state.languages.updatingUserLanguages,
  fetchingUserLanguages: state.languages.fetchingUserLanguages
})

export default connect(mapStateToProps)(LanguagesCard)

class LanguagesSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: Math.ceil(
        (props.userLanguage.spoken + props.userLanguage.written) / 2
      ),
      editMode: false,
      addMode: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.updateLanguages = this.updateLanguages.bind(this)
    this.removeLanguage = this.removeLanguage.bind(this)
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

  updateLanguages() {
    this.setState({
      editMode: false
    })

    let { userLanguages, userLanguage } = this.props
    let { value } = this.state

    let index = _.findIndex(userLanguages, { id: userLanguage.id })
    let newLanguages = Object.assign([], userLanguages)
    newLanguages[index].spoken = value
    newLanguages[index].written = value

    this.props.updateFn(newLanguages)
  }

  removeLanguage() {
    this.setState({
      editMode: false
    })

    let { userLanguages, userLanguage } = this.props

    let newLanguages = _.filter(userLanguages, function(language) {
      return language.id !== userLanguage.id
    })

    this.props.updateFn(newLanguages)
  }

  revertChanges() {
    this.setState({
      editMode: false,
      value: (this.props.spoken + this.props.written) / 2
    })
  }

  render() {
    let { value, editMode } = this.state
    let { name, spoken } = this.props

    return (
      <Col
        xs={12}
        md={6}
        className="language-wrapper"
        style={{ zIndex: editMode && 2 }}
      >
        <h5 className="mb-0">{name}</h5>
        <div className="d-flex flex-row">
          <div className="languages-slider">
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
            <div className="value text-center">{getLanguageString(value)}</div>
          </div>
          {!editMode && (
            <div className="language-buttons edit-remove-buttons">
              <div
                className="language-button edit-remove-button edit"
                onClick={this.toggleEditMode}
              >
                <i className="fa fa-edit ml-1" />
              </div>
              <div
                className="language-button edit-remove-button"
                onClick={this.removeLanguage}
              >
                <i className="fa fa-trash ml-1" />
              </div>
            </div>
          )}
          {editMode && (
            <div className="language-buttons edit-remove-buttons--edit-mode edit-remove-buttons">
              <div
                className="language-button edit-remove-button done"
                onClick={this.updateLanguages}
              >
                <i className="fa fa-check ml-1" />
              </div>
              <div
                className="language-button edit-remove-button revert"
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

LanguagesSlider.propTypes = {
  updateFn: PropTypes.func.isRequired
}

class LanguagesForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      languages: this.setUpLanguages(),
      value: undefined,
      spoken: 1,
      options: []
    }

    this.setUpLanguages = this.setUpLanguages.bind(this)
    this.addLanguage = this.addLanguage.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userLanguages !== this.props.userLanguages) {
      this.setState({
        languages: this.setUpLanguages(),
        value: undefined
      })
    }
  }

  setUpLanguages() {
    let { languages } = this.props
    let { userLanguages } = this.props
    let optiondata = []
    let index = -1

    $.each(languages, function(x, item) {
      index = _.findIndex(userLanguages, { id: item.id })
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

  addLanguage() {
    let { updateFn, userLanguages } = this.props
    let { value, spoken } = this.state
    let languageToAdd = {
      id: value,
      spoken: spoken,
      written: spoken
    }

    let newLanguages = update(userLanguages, { $push: [languageToAdd] })

    updateFn(newLanguages)
  }

  render() {
    let { value, languages, spoken } = this.state
    const { isOpen } = this.props

    return (
      <Collapse isOpen={isOpen}>
        <div className="languages-form mb-3 py-3">
          <Row>
            <Col xs={12} md={6}>
              <Select
                name="form-field-name"
                simpleValue
                value={value}
                onChange={value => this.setState({ value: value })}
                options={languages}
                placeholder="Välj språk"
              />
            </Col>
            <Col xs={12} md={6}>
              <div className="language-slider">
                <Slider
                  min={1}
                  max={5}
                  handle={handle}
                  dots
                  value={spoken}
                  onChange={value => this.setState({ spoken: value })}
                  className="mr-4"
                />
                <div className="value text-center">
                  {getLanguageString(spoken)}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <Button
                className="mr-3"
                disabled={!value}
                onClick={this.addLanguage}
              >
                Lägg till språk
              </Button>
            </Col>
          </Row>
        </div>
      </Collapse>
    )
  }
}

LanguagesForm.propTypes = {
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

const getLanguageString = value => {
  switch (value) {
    case 1:
      return 'Inga kunskaper'
    case 2:
      return 'Begränsad yrkeskunskap'
    case 3:
      return 'Grundläggande yrkeskunskap'
    case 4:
      return 'Professionell yrkeskunskap'
    case 5:
      return 'Modersmål'
    default:
      return '-'
  }
}
