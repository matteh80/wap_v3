import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap'
import noPic from './noPic.png'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { uploadProfilePic } from '../../store/modules/profile'
import LoadingButton from '../LoadingButton/LoadingButton'

class ProfilePicture extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: false,
      tmpImage: '',
      loadsave: false,
      isSet: false
    }

    this.onDrop = this.onDrop.bind(this)
    this._crop = this._crop.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1])
    } else {
      byteString = unescape(dataURI.split(',')[1])
    }

    // separate out the mime component
    let mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0]

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ia], { type: mimeString })
  }

  onDrop(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles)
    this.setState(
      {
        tmpImage: acceptedFiles[0].preview
      },
      this.toggleModal()
    )
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    })
  }

  _crop() {
    let { dispatch } = this.props

    let blob = this.dataURItoBlob(
      this.refs.cropper.getCroppedCanvas().toDataURL()
    )
    let fd = new FormData()

    fd.append('file', blob)

    dispatch(uploadProfilePic(fd)).then(() => {
      this.toggleModal()
    })
  }

  render() {
    const { profilepicture, uploadingPicture } = this.props
    const { tmpImage, modal } = this.state
    return (
      <div className={cn('profile-picture')}>
        <Dropzone accept="image/*" onDrop={this.onDrop} className="dropzone">
          <div className="upload-icon">
            <i className="fas fa-upload" />
          </div>
        </Dropzone>
        {uploadingPicture && (
          <i
            className="fas fa-spin fa-spinner"
            style={{ fontSize: 50, color: '#ffffff' }}
          />
        )}
        {!uploadingPicture && (
          <img src={profilepicture ? profilepicture : noPic} />
        )}

        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalBody className="no-padding">
            <Cropper
              ref="cropper"
              src={tmpImage}
              style={{ height: 400, width: '100%' }}
              // Cropper.js options
              aspectRatio={1 / 1}
              guides={false}
            />
          </ModalBody>
          <ModalFooter>
            <LoadingButton
              text="Klar"
              loadingText="Laddar upp..."
              onClick={this._crop}
            >
              Klar
            </LoadingButton>{' '}
            <Button
              color="secondary"
              onClick={this.toggleModal}
              disabled={uploadingPicture}
            >
              Avbryt
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.profile.id,
  profilepicture: state.profile.profilepicture,
  uploadingPicture: state.profile.uploadingPicture
})

export default connect(mapStateToProps)(ProfilePicture)

ProfilePicture.propTypes = {
  circle: PropTypes.bool
}
