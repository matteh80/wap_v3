import React from 'react'
import moment from 'moment'
import 'moment/min/locales'
import { Row, Col, Input, Label } from 'reactstrap'
import { AvGroup, AvField } from 'availity-reactstrap-validation'
import Checkbox from '../../../../components/Checkbox/Checkbox'

class StartEndDate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      start_date: props.defaultValues
        ? moment(props.defaultValues[0]).format('YYYY-MM-DD')
        : moment().format('YYYY') + '-01-01',
      end_date: props.defaultValues
        ? moment(props.defaultValues[1]).format('YYYY-MM-DD')
        : moment().format('YYYY') + '-01-31',
      current: props.defaultValues ? props.defaultValues[2] : false
    }

    moment.locale('sv-SE')

    this.handleCurrentChange = this.handleCurrentChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  getYearArray() {
    let yearArray = []
    let yearNow = moment().format('YYYY')
    for (let y = 1940; y <= parseInt(yearNow); y++) {
      yearArray.push(y)
    }

    return yearArray.reverse()
  }

  handleCurrentChange() {
    this.setState({
      current: !this.state.current
    })
  }

  handleSelectChange(event) {
    const target = event.target
    const { start_date, end_date } = this.state

    if (target) {
      const value = target.value
      const name = target.name

      if (name.includes('start_date')) {
        let newStartDate
        if (isNaN(value)) {
          newStartDate = moment(start_date).month(value)
        } else {
          newStartDate = moment(start_date).year(value)
        }
        this.setState({
          start_date: moment(newStartDate).format('YYYY-MM-DD')
        })
      } else {
        let newEndDate
        if (isNaN(value)) {
          newEndDate = moment(end_date).month(value)
        } else {
          newEndDate = moment(end_date).year(value)
        }
        this.setState({
          end_date: moment(newEndDate).format('YYYY-MM-DD')
        })
      }
    }
  }

  render() {
    const { start_date, end_date, current } = this.state
    const { withCurrent } = this.props

    return (
      <AvGroup className="col-12 col-md-6 start-end-date">
        <Row>
          <Col xs={12}>
            <div className="d-flex flex-row">
              <div className="d-flex flex-column mr-3">
                <Label>Från</Label>
                <div className="d-flex flex-row">
                  <Input
                    type="select"
                    name="start_date_month"
                    className="month"
                    onChange={this.handleSelectChange}
                    defaultValue={moment(start_date).format('MMMM')}
                  >
                    {moment.months().map((month, index) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </Input>
                  <Input
                    type="select"
                    name="start_date_year"
                    onChange={this.handleSelectChange}
                    defaultValue={moment(start_date).year()}
                  >
                    {this.getYearArray().map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Input>
                  <AvField type="hidden" name="start_date" value={start_date} />
                </div>
              </div>
              <div className="d-flex flex-column">
                <Label>Till</Label>
                <div className="d-flex flex-row">
                  <Input
                    type="select"
                    name="end_date_month"
                    className="month"
                    disabled={current}
                    onChange={this.handleSelectChange}
                    defaultValue={moment(end_date).format('MMMM')}
                  >
                    {moment.months().map((month, index) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </Input>
                  <Input
                    type="select"
                    name="end_date_year"
                    disabled={current}
                    onChange={this.handleSelectChange}
                    defaultValue={moment(end_date).year()}
                  >
                    {this.getYearArray().map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Input>
                  <AvField type="hidden" name="end_date" value={end_date} />
                </div>
              </div>
            </div>
          </Col>
          {withCurrent && (
            <Col xs={12} className="mt-2">
              <Checkbox
                label="Nuvarande"
                name="hidden"
                onChange={this.handleCurrentChange}
                defaultChecked={current}
              />
              <AvField type="hidden" name="current" value={current} />
            </Col>
          )}
        </Row>
      </AvGroup>
    )
  }
}

export default StartEndDate
