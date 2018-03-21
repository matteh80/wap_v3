import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Label, Input, FormText } from 'reactstrap'
import classnames from 'classnames'

class Checkbox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      checked: !!props.defaultChecked
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange() {
    this.props.onChange(this.props.name)

    this.setState({
      checked: !this.state.checked
    })
  }

  render() {
    const { checked } = this.state
    const { label, helpText, name, disabled } = this.props
    return (
      <FormGroup
        check
        className={classnames('custom-checkbox', checked && 'checked')}
      >
        <Label check>
          <Input
            type="checkbox"
            name={name}
            onChange={this.onChange}
            disabled={disabled}
          />
          <i
            className={classnames(
              'mr-2',
              checked ? 'fas fa-check-circle' : 'far fa-circle'
            )}
          />
          {label}
        </Label>
        <FormText color="muted">{helpText}</FormText>
      </FormGroup>
    )
  }
}

Checkbox.propTypes = {
  defaultChecked: PropTypes.bool,
  label: PropTypes.string,
  helpText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

export default Checkbox
