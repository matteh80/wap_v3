import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, Row, Col, Badge } from 'reactstrap'
import classnames from 'classnames'

class ProfileEditableCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addMode: false
    }

    this.handleAddNew = this.handleAddNew.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.addMode !== this.state.addMode) {
      this.props.cbAddMode(this.state.addMode)
    }
  }

  handleAddNew() {
    this.setState({
      addMode: !this.state.addMode
    })
  }

  render() {
    let { addMode } = this.state
    const {
      children,
      cardTitle,
      loading,
      fetching,
      id,
      isDone,
      inEditMode
    } = this.props

    return (
      <Card
        className={classnames(
          'profile-card mb-5',
          addMode && 'inAddMode',
          inEditMode && 'inEditMode',
          fetching && 'fetching'
        )}
        id={id}
      >
        <div className={classnames('loading-progress', loading && 'visible')} />
        <div
          className={classnames(
            'addNew',
            addMode && 'addMode',
            fetching && 'fetching'
          )}
          onClick={!fetching ? this.handleAddNew : undefined}
        >
          <span className="addNewText">{addMode ? 'Stäng' : 'Lägg till'}</span>
          <div className="addNewIcon">
            {fetching ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : (
              <i className="fa fa-plus" />
            )}
          </div>
        </div>
        <CardBody>
          <Row>
            <Col xs={10}>
              <CardTitle className="mb-4">
                {cardTitle}{' '}
                <Badge
                  className={classnames('ml-4', isDone && 'isDone')}
                  color="accent"
                >
                  Ofullständig
                </Badge>
              </CardTitle>
            </Col>
          </Row>
          {children}
        </CardBody>
      </Card>
    )
  }
}

export default ProfileEditableCard

ProfileEditableCard.propTypes = {
  cardTitle: PropTypes.string,
  cbAddMode: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  fetching: PropTypes.bool,
  isDone: PropTypes.bool.isRequired,
  inEditMode: PropTypes.bool
}
