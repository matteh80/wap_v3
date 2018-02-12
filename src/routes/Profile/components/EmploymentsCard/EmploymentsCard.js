import React from 'react'
import { connect } from 'react-redux'
import { fetchEmployments } from '../../../../store/modules/employments'
import ProfileEditableCard from '../ProfileEditableCard'
import { Row } from 'reactstrap'
import classnames from 'classnames'

class EmploymentsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      employmentsInEditMode: false,
      addMode: false,
      userEmployments: []
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.cbEditMode = this.cbEditMode.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props

    dispatch(fetchEmployments()).then(() => {
      this.setState({
        allLoaded: true,
        userEmployments: this.props.userEmployments
      })
    })
  }

  cbEditMode(editMode) {
    this.setState({
      employmentsInEditMode: editMode
    })
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  render() {
    let { addMode, employmentsInEditMode } = this.state
    let { updatingEmployments, userEmployments } = this.props
    return (
      <ProfileEditableCard
        cardTitle="Anställningar"
        cbAddMode={this.cbAddMode}
        loading={updatingEmployments}
      >
        <Row className="profile-content">
          <div
            className={classnames(
              'overlay',
              (addMode || employmentsInEditMode || updatingEmployments) &&
                'active'
            )}
          />
          {userEmployments &&
            userEmployments.map(employment => <h4>{employment.title}</h4>)}
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  userEmployments: state.employments.userEmployments,
  updatingEmployments: state.employments.updatingEmployments
})

export default connect(mapStateToProps)(EmploymentsCard)

class EmploymentsForm extends React.Component {
  constructor(props) {
    super(props)
  }
}
