import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import { Row, Col, Badge, Collapse } from 'reactstrap'
import {
  editUserMotivations,
  fetchAllMotivations,
  fetchUserMotivations
} from '../../../../store/modules/motivations'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'

class MotivationsCard extends React.Component {
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
      dispatch(fetchUserMotivations()),
      dispatch(fetchAllMotivations())
    ])
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  render() {
    const {
      item,
      userMotivations,
      allMotivations,
      updatingUserMotivations,
      fetchingUserMotivations
    } = this.props

    const { addMode } = this.state

    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingUserMotivations}
        fetching={fetchingUserMotivations}
        noForm
        item={item}
      >
        <Row className="profile-content">
          <Col xs={12}>
            {userMotivations &&
              userMotivations.map(item => (
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
                <h5>Vad är det som driver dig framåt i arbetslivet?</h5>
              </Col>
              {addMode &&
                allMotivations &&
                allMotivations.map(motivation => (
                  <MotivationItem
                    key={motivation.id}
                    motivation={motivation}
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
  isDone: state.profile.progress.items.motivations.done,
  userMotivations: state.motivations.userMotivations,
  allMotivations: state.motivations.allMotivations,
  updatingUserMotivations: state.motivations.updatingUserMotivations,
  fetchingUserMotivations: state.motivations.updatingUserMotivations
})

export default connect(mapStateToProps)(MotivationsCard)

class MotivationItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      updating: false
    }

    this.addRemove = this.addRemove.bind(this)
    this.remove = this.remove.bind(this)
  }

  addRemove() {
    const { dispatch, motivation } = this.props
    dispatch(editUserMotivations(motivation))
  }

  remove(motivation) {}

  render() {
    const { motivation } = this.props
    return (
      <Col xs={12} sm={6} md={4} lg={3} className="mb-1" key={motivation.id}>
        <Badge
          pill
          className={classnames(
            'profile-select-item w-100',
            motivation.selected && 'selected'
          )}
          onClick={this.addRemove}
        >
          {motivation.name}
        </Badge>
      </Col>
    )
  }
}

MotivationItem.propTypes = {
  motivation: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}
