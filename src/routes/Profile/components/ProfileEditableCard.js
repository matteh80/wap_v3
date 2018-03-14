import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
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
    const { children, cardTitle, loading, fetching, id } = this.props

    return (
      <Card className="profile-card mb-5" id={id}>
        <div className={classnames('loading-progress', loading && 'visible')} />
        <div
          className={classnames(
            'addNew',
            addMode && 'addMode',
            fetching && 'fetching'
          )}
          onClick={!fetching ? this.handleAddNew : undefined}
        >
          {fetching ? (
            <i className="fas fa-circle-notch fa-spin" />
          ) : (
            <i className="fa fa-plus" />
          )}
        </div>
        <CardBody>
          <Row>
            <Col xs={10}>
              <CardTitle>{cardTitle}</CardTitle>
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
  fetching: PropTypes.bool
}
