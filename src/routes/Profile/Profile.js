import React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import $ from 'jquery'
import ProfileProgress from './components/ProfileProgress/ProfileProgress'
import { setProfileProgress } from '../../store/modules/profile'
import EmploymentsCard from '../../routes/Profile/components/EmploymentsCard/EmploymentsCard'
import SkillsCard from '../../routes/Profile/components/SkillsCard/SkillsCard'
import LanguagesCard from '../../routes/Profile/components/LanguagesCard/LanguagesCard'
import OccupationsCard from '../../routes/Profile/components/OccupationsCard/OccupationsCard'
import EducationsCard from '../../routes/Profile/components/EducationsCard/EducationsCard'
import LicensesCard from '../../routes/Profile/components/LicensesCard/LicensesCard'
import MotivationsCard from '../../routes/Profile/components/MotivationsCard/MotivationsCard'
import PersonalitiesCard from '../../routes/Profile/components/PersonalitiesCard/PersonalitiesCard'
import GeneralCard from '../../routes/Profile/components/GeneralCard/GeneralCard'
import WapfilmCard from '../../routes/Profile/components/WapfilmCard/WapfilmCard'
import TalentQCard from '../../routes/Profile/components/TalentQCard/TalentQCard'
import ProfileTips from './components/ProfileTips/ProfileTips'
import _ from 'lodash'

class Profile extends React.Component {
  componentDidMount() {
    $(window).scroll(function() {
      $('#profile-sidenav').css('top', $('.header').height() + 40)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.props.dispatch(setProfileProgress())
    }
  }

  getComponent(item) {
    switch (item.id) {
      case 'general':
        return <GeneralCard item={item} />
      case 'employments':
        return <EmploymentsCard item={item} />
      case 'educations':
        return <EducationsCard item={item} />
      case 'skills':
        return <SkillsCard item={item} />
      case 'languages':
        return <LanguagesCard item={item} />
      case 'occupations':
        return <OccupationsCard item={item} />
      case 'drivinglicenses':
        return <LicensesCard item={item} />
      case 'motivations':
        return <MotivationsCard item={item} />
      case 'personalities':
        return <PersonalitiesCard item={item} />
      case 'wapfilm':
        return <WapfilmCard item={item} />
      case 'talentq':
        return <TalentQCard item={item} />
      default:
        return (
          <div className="card">
            <div className="card-body">Error?</div>
          </div>
        )
    }
  }

  render() {
    const { items } = this.props
    const mItems = _.values(items)

    return (
      <div>
        {/*<SideNav />*/}
        <Container className="profile">
          <Row>
            <Col xs={12} md={3} className="left fixed d-none d-md-block">
              <ProfileTips />
              <ProfileProgress />
            </Col>
            <Col xs={12} md={9} className="right">
              {mItems &&
                mItems.map(item => {
                  return this.getComponent(item)
                })}
            </Col>
          </Row>
        </Container>
        <div className="profile-footer">
          <Container>
            <Row>
              <Col xs={12}>asdasd</Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userEmployments: state.employments.userEmployments,
  userEducations: state.educations.userEducations,
  userSkills: state.skills.userSkills,
  userLanguages: state.languages.userLanguages,
  userOccupations: state.occupations.userOccupations,
  userDrivinglicenses: state.drivinglicenses.userDrivinglicenses,
  userMotivations: state.motivations.userMotivations,
  userPersonalities: state.personalities.userPersonalities,
  wapFilm: state.wapfilm,
  items: state.profile.progress.items
})

export default connect(mapStateToProps)(Profile)
