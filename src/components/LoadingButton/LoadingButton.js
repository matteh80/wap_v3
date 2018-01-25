import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'

class LoadingButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { loading, text, loadingText, totSteps, finishedStep } = this.props
    return (
      <div className="loading-button--wrapper">
        <div
          className="loading-button--loader"
          style={{
            width: finishedStep / totSteps * 100 + '%',
            maxWidth: '100%'
          }}
        />
        <Button className="loading-button--btn" disabled={loading}>
          {loading ? (loadingText ? loadingText : text) : text}
          {loading && <i className="fa fa-spinner fa-spin ml-2" />}
        </Button>
      </div>
    )
  }
}

export default connect(state => state)(LoadingButton)

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  text: PropTypes.string.isRequired,
  loadingText: PropTypes.string,
  totSteps: PropTypes.number,
  finishedStep: PropTypes.number
}
