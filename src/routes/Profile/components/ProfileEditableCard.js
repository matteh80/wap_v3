import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, Row, Col, Badge, Alert } from 'reactstrap'
import classnames from 'classnames'

class ProfileEditableCard extends React.Component {
  constructor(props) {
    super(props)

    this.cardTitle = props.cardTitle

    this.handleAddNew = this.handleAddNew.bind(this)
  }

  handleAddNew() {
    const { cbAddMode, addMode } = this.props
    cbAddMode(!addMode)
  }

  render() {
    const {
      addMode,
      children,
      cardTitle,
      loading,
      fetching,
      id,
      isDone,
      inEditMode,
      noForm,
      errors,
      closeText
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
        <div
          className={classnames(
            'loading-progress',
            loading && 'visible',
            errors && 'error'
          )}
        />
        <div
          className={classnames(
            'addNew',
            addMode && 'addMode',
            fetching && 'fetching'
          )}
          onClick={!fetching ? this.handleAddNew : undefined}
        >
          <span className="addNewText">
            {addMode
              ? closeText ? closeText : 'Stäng'
              : noForm ? 'Ändra' : 'Lägg till'}
          </span>
          <div className="addNewIcon">
            {fetching ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : noForm ? (
              addMode ? (
                <i className="fa fa-plus" />
              ) : (
                <i className="fa fa-pencil-alt" />
              )
            ) : (
              <i className="fa fa-plus" />
            )}
          </div>
        </div>
        <CardBody>
          {errors && (
            <Row>
              <Col xs={12}>
                <Alert color="danger">
                  {Object.keys(errors).map(function(key) {
                    return errors[key]
                  })}
                </Alert>
              </Col>
            </Row>
          )}
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
  cbAddMode: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  fetching: PropTypes.bool,
  isDone: PropTypes.bool.isRequired,
  inEditMode: PropTypes.bool,
  noForm: PropTypes.bool
}
