import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'reactstrap'
import ProfileEditableCard from '../ProfileEditableCard'
import { getTestStatus, initiateTest } from '../../../../store/modules/talentq'

class TalentQCard extends React.Component {
  constructor(props) {
    super(props)
    this.startTest = this.startTest.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props
    dispatch(getTestStatus())
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  startTest() {
    const { dispatch, test } = this.props
    dispatch(initiateTest('sv')).then(result => {
      window.location.href = test.assessment_url
    })
  }

  render() {
    const { isDone, item, fetchingTest, test } = this.props
    return (
      <ProfileEditableCard
        cbAddMode={this.cbAddMode}
        fetching={fetchingTest}
        noForm
        plainCard
        ongoing={test.initiated && !test.complete}
        loading={fetchingTest}
        item={item}
      >
        <Row className="profile-content">
          {!isDone && (
            <Col xs={12}>
              <p>
                Här kommer du att få göra ett unikt online-test som är speciellt
                framtaget för att du ska få visa vem du är, och vad just du är
                bra på. Testet kommer pröva beteende, motivation och
                personlighet. Genom att hjälpa dig att bättre förstå dina egna
                beteende preferenser och vad du brinner för, ökar du chansen
                betydligt till att nå ditt drömjobb.
              </p>
              <Button onClick={this.startTest}>
                {test.initiated ? 'Återuppta testet' : 'Starta testet'}
              </Button>
            </Col>
          )}
          {isDone && (
            <Col xs={12}>
              Du hittar resultatet för testet här:{' '}
              <a href={test.result_url} target="_blank">
                {test.result_url}
              </a>
            </Col>
          )}
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.talentq.done,
  test: state.talentq.test,
  fetchingTest: state.talentq.fetchingTest
})
export default connect(mapStateToProps)(TalentQCard)
