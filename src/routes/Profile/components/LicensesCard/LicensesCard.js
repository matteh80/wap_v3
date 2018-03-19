import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import { Row, Col, Badge, Collapse } from 'reactstrap'
import {
  editUserDrivinglicenses,
  fetchAllDrivinglicenses,
  fetchUserDrivinglicenses
} from '../../../../store/modules/drivinglicenses'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'

class LicensesCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addMode: false
    }

    this.cbAddMode = this.cbAddMode.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    Promise.all([
      dispatch(fetchUserDrivinglicenses()),
      dispatch(fetchAllDrivinglicenses())
    ])
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  render() {
    const {
      isDone,
      userDrivinglicenses,
      allDrivinglicenses,
      updatingUserDrivinglicenses,
      fetchingUserDrivinglicenses
    } = this.props

    const { addMode } = this.state

    return (
      <ProfileEditableCard
        id="drivinglicenses"
        cardTitle="Körkort"
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingUserDrivinglicenses}
        fetching={fetchingUserDrivinglicenses}
        isDone={isDone}
        noForm
      >
        <Row className="profile-content">
          <Col xs={12}>
            {userDrivinglicenses &&
              userDrivinglicenses.map(item => (
                <Badge
                  pill
                  className={classnames('mr-1', addMode && 'disabled')}
                >
                  {item.name}
                </Badge>
              ))}
          </Col>
          <Collapse isOpen={addMode} className="pt-3 col-12">
            <Row className="p-0">
              <Col xs={12}>
                <h5>Vad har du för kör- och truckkort?</h5>
              </Col>
              {addMode &&
                allDrivinglicenses &&
                allDrivinglicenses.map(license => (
                  <LicenseItem
                    key={license.id}
                    license={license}
                    dispatch={this.props.dispatch}
                  />
                ))}
            </Row>
          </Collapse>
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.drivinglicenses.done,
  userDrivinglicenses: state.drivinglicenses.userDrivinglicenses,
  allDrivinglicenses: state.drivinglicenses.allDrivinglicenses,
  updatingUserDrivinglicenses:
    state.drivinglicenses.updatingUserDrivinglicenses,
  fetchingUserDrivinglicenses: state.drivinglicenses.updatingUserDrivinglicenses
})

export default connect(mapStateToProps)(LicensesCard)

class LicenseItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      updating: false
    }

    this.addRemove = this.addRemove.bind(this)
    this.remove = this.remove.bind(this)
  }

  addRemove() {
    const { dispatch, license } = this.props
    dispatch(editUserDrivinglicenses(license))
  }

  remove(license) {}

  render() {
    const { license } = this.props
    return (
      <Col xs={12} sm={6} md={4} lg={3} className="mb-1" key={license.id}>
        <Badge
          pill
          className={classnames(
            'profile-select-item w-100',
            license.selected && 'selected'
          )}
          onClick={this.addRemove}
        >
          {license.name}
        </Badge>
      </Col>
    )
  }
}

LicenseItem.propTypes = {
  license: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}
