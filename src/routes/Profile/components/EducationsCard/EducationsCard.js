import React from 'react'
import ProfileEditableCard from '../ProfileEditableCard'

class EducationsCard extends React.Component {
  render() {
    return (
      <ProfileEditableCard
        id="educations"
        cardTitle="Utbildning"
        cbAddMode={undefined}
        loading={false}
      />
    )
  }
}

export default EducationsCard
