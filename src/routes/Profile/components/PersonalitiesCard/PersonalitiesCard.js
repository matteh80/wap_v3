import React from 'react'
import { connect } from 'react-redux'
import ProfileEditableCard from '../ProfileEditableCard'
import { Row, Col, Badge, Collapse } from 'reactstrap'
import {
  editUserPersonalities,
  fetchAllPersonalities,
  fetchUserPersonalities
} from '../../../../store/modules/personalities'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const max = 5
class PersonalitiesCard extends React.Component {
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
      dispatch(fetchUserPersonalities()),
      dispatch(fetchAllPersonalities())
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
      userPersonalities,
      allPersonalities,
      updatingUserPersonalities,
      fetchingUserPersonalities
    } = this.props

    const { addMode } = this.state
    const count = userPersonalities.length
    const maxReached = count >= max

    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={updatingUserPersonalities}
        fetching={fetchingUserPersonalities}
        noForm
        item={item}
      >
        <Row className="profile-content">
          <Col xs={12}>
            {userPersonalities &&
              userPersonalities.map(item => (
                <Badge
                  key={item.id}
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
                <h5>
                  Vad utmärker din personlighet? ({count} av {max} valda)
                </h5>
              </Col>
              {addMode &&
                allPersonalities &&
                allPersonalities.map(personality => (
                  <PersonalityItem
                    key={personality.id}
                    personality={personality}
                    dispatch={this.props.dispatch}
                    disabled={maxReached && !personality.selected}
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
  isDone: state.profile.progress.items.personalities.done,
  userPersonalities: state.personalities.userPersonalities,
  allPersonalities: state.personalities.allPersonalities,
  updatingUserPersonalities: state.personalities.updatingUserPersonalities,
  fetchingUserPersonalities: state.personalities.updatingUserPersonalities
})

export default connect(mapStateToProps)(PersonalitiesCard)

class PersonalityItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      updating: false
    }

    this.addRemove = this.addRemove.bind(this)
  }

  addRemove() {
    const { dispatch, personality, disabled } = this.props
    !disabled && dispatch(editUserPersonalities(personality))
  }

  render() {
    const { personality, disabled } = this.props
    return (
      <Col
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className={classnames('mb-1', disabled && 'disabled')}
        key={personality.id}
      >
        <Badge
          pill
          className={classnames(
            'profile-select-item w-100',
            personality.selected && 'selected'
          )}
          onClick={this.addRemove}
        >
          {personality.name}
        </Badge>
      </Col>
    )
  }
}

PersonalityItem.propTypes = {
  personality: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}
