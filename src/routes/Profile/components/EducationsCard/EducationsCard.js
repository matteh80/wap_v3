import React from 'react'
import ProfileEditableCard from '../ProfileEditableCard'

class EducationsCard extends React.Component {
  render() {
    return (
      <ProfileEditableCard
        id="educations"
        cardTitle="Utbildning"
        cbAddMode={null}
        loading={null}
      />
    )
  }
}

export default EducationsCard
