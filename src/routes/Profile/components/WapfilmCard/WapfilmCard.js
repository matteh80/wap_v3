import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'reactstrap'
import ProfileEditableCard from '../ProfileEditableCard'
import {
  deleteVideo,
  fetchWapfilm,
  setVideoInfo
} from '../../../../store/modules/wapfilm'
import { apiClient } from '../../../../store/axios.config'
import Dropzone from 'react-dropzone'

class WapfilmCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addMode: false,
      videoSrc: undefined,
      loadingPercent: undefined
    }

    this.cbAddMode = this.cbAddMode.bind(this)
    this.downloadVideoFromServer = this.downloadVideoFromServer.bind(this)
    this.uploadVideoToServer = this.uploadVideoToServer.bind(this)
    this.removeVideo = this.removeVideo.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  componentDidMount() {
    let { dispatch } = this.props
    dispatch(fetchWapfilm())
  }

  cbAddMode(addMode) {
    this.setState({
      addMode: addMode
    })
  }

  downloadVideoFromServer() {
    const { wapfilm } = this.props
    let _this = this

    apiClient
      .get('download/videos/' + wapfilm[0].id, {
        responseType: 'blob',
        onDownloadProgress: function(e) {
          const percent = e.loaded / e.total * 100
          _this.setState({
            loadingPercent: percent
          })
        }
      })
      .then(result => {
        this.setState({
          videoSrc: URL.createObjectURL(result.data),
          loadingPercent: undefined
        })
      })
  }

  uploadVideoToServer(data) {
    const _this = this
    let { dispatch } = this.props
    apiClient.defaults.timeout = 180000
    apiClient
      .post('me/videos/', data, {
        onUploadProgress: function(e) {
          const percent = e.loaded / e.total * 100
          _this.setState({
            loadingPercent: percent
          })
        }
      })
      .then(result => {
        dispatch(setVideoInfo(result.data))
        this.setState({
          loadingPercent: undefined
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  removeVideo() {
    const { dispatch, wapfilm } = this.props
    dispatch(deleteVideo(wapfilm[0].id))
  }

  onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length > 0) {
      this.setState({
        videoSrc: acceptedFiles[0].preview
      })
      if (acceptedFiles.length > 0) {
        let data = new FormData()
        data.append('file', acceptedFiles[0])

        this.uploadVideoToServer(data)
      }
    } else {
      console.log(rejectedFiles)
      if (Math.abs(276134947 / 1048576).toFixed(2) > 100) {
        this.setState({
          errorMsg: 'För stor fil, maxstorlek är 100 mb'
        })
      }
    }
  }

  render() {
    const {
      item,
      isDone,
      wapfilm,
      fetchingWapfilm,
      uploadingWapfilm
    } = this.props
    const { addMode, videoSrc, loadingPercent } = this.state

    return (
      <ProfileEditableCard
        addMode={addMode}
        cbAddMode={this.cbAddMode}
        loading={uploadingWapfilm}
        loadingPercent={loadingPercent}
        fetching={fetchingWapfilm}
        noForm
        item={item}
      >
        <Row className="profile-content">
          <Col xs={12}>
            {isDone && (
              <Row>
                <Col xs={12} md={6} lg={4}>
                  {!videoSrc && (
                    <div className="media-wrapper">
                      <div
                        className="video-placeholder"
                        onClick={this.downloadVideoFromServer}
                      >
                        <i className="fas fa-play-circle" />
                      </div>
                    </div>
                  )}
                  {videoSrc && (
                    <video
                      id="video"
                      width="100%"
                      height="auto"
                      controls
                      preload="true"
                    >
                      <source src={videoSrc} />
                      Your browser does not support HTML5 video.
                    </video>
                  )}
                </Col>

                <Col xs={12} md={6} lg={8}>
                  <div>
                    <h6>Filnamn: {wapfilm[0] && wapfilm[0].filename}</h6>
                    <h6>
                      Storlek: {wapfilm[0] && formatBytes(wapfilm[0].size, 2)}
                    </h6>
                    {addMode &&
                      wapfilm.length > 0 && (
                        <Button onClick={this.removeVideo}>Radera</Button>
                      )}
                  </div>
                </Col>
              </Row>
            )}
            {!isDone &&
              addMode && (
                <Row>
                  <Col xs={12} md={6}>
                    <Dropzone
                      className="dropzone"
                      accept="video/*"
                      multiple={false}
                      maxSize={100000000}
                      onDrop={this.onDrop}
                    >
                      <div className="upload-icon">
                        <i className="fas fa-upload" />
                      </div>
                      Klicka här eller dra och släpp en videofil här för att
                      ladda upp
                    </Dropzone>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      WAP Film är en 60 s video där du har möjlighet att kort
                      presentera dig själv för potentiella arbetsgivare. Du
                      kommer svara på 6 st frågor som vi tagit fram och det
                      finns inget rätt eller fel svar. Du spelar in filmen själv
                      och laddar sedan upp den när du känner dig nöjd.
                    </p>
                    <ol>
                      <li>Presentera dig själv kortfattat</li>
                      <li>
                        Vad har du för sysselsättning idag Vilka personliga
                        egenskaper beskriver dig bäst
                      </li>{' '}
                      <li>
                        Beskriv ditt drömjobb (målsättning, framtidsplaner,
                        ambition)
                      </li>
                      <li>
                        {' '}
                        Hur skulle dina kollegor beskriva dig / Vad gör dig till
                        en bra kollega
                      </li>
                      <li>Det här är det få som vet om mig</li>
                    </ol>
                  </Col>
                </Row>
              )}
          </Col>
        </Row>
      </ProfileEditableCard>
    )
  }
}

const mapStateToProps = state => ({
  isDone: state.profile.progress.items.wapfilm.done,
  fetchingWapfilm: state.wapfilm.fetchingWapfilm,
  uploadingWapfilm: state.wapfilm.uploadingWapfilm,
  wapfilm: state.wapfilm.wapfilm
})

export default connect(mapStateToProps)(WapfilmCard)

function formatBytes(a, b) {
  if (0 == a) return '0 Bytes'
  var c = 1024,
    d = b || 2,
    e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}
