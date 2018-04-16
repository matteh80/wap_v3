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
      loading,
      loadingPercent,
      fetching,
      inEditMode,
      noForm,
      errors,
      closeText,
      item,
      plainCard,
      ongoing
    } = this.props

    return (
      <Card
        className={classnames(
          'profile-card mb-5',
          'level-' + item.level,
          addMode && 'inAddMode',
          inEditMode && 'inEditMode',
          fetching && 'fetching',
          'done-' + item.done
        )}
        id={item && item.id}
      >
        <LoadingProgress
          loading={loading}
          loadingPercent={loadingPercent}
          errors={errors}
        />
        <div
          className={classnames(
            'addNew',
            addMode && 'addMode',
            fetching && 'fetching',
            plainCard && 'hidden'
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
            <Col xs={12}>
              <CardTitle className="mb-4">
                <i
                  className={classnames('title-icon fas', item && item.icon)}
                />
                {item && item.name}{' '}
                {ongoing ? (
                  <Badge
                    className={classnames(
                      'ml-4',
                      item && item.done && 'isDone'
                    )}
                    color="primary"
                  >
                    Pågående
                  </Badge>
                ) : (
                  <Badge
                    className={classnames(
                      'ml-4',
                      item && item.done && 'isDone'
                    )}
                    color="accent"
                  >
                    Ofullständig
                  </Badge>
                )}
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
  cbAddMode: PropTypes.func,
  loading: PropTypes.bool,
  loadingPercent: PropTypes.number,
  fetching: PropTypes.bool,
  inEditMode: PropTypes.bool,
  noForm: PropTypes.bool,
  item: PropTypes.object.isRequired,
  plainCard: PropTypes.bool
}

const LoadingProgress = props => {
  const { loading, loadingPercent, errors } = props
  const width = loadingPercent ? loadingPercent + '%' : '100%'
  const visible = loading || loadingPercent

  return (
    <div
      className={classnames(
        'loading-progress',
        visible && 'visible',
        errors && 'error'
      )}
    >
      <div className="loading-progressbar" style={{ width: width }} />
    </div>
  )
}
