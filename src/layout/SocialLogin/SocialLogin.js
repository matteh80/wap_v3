import React from 'react'
import $ from 'jquery'
import URLSearchParams from 'url-search-params'
import { connect } from 'react-redux'
import { socialLogin } from '../../store/modules/auth'

/* global gapi */
/* global FB */
/* global graph */
/* global IN */
class SocialLogin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      iframeUrl: 'Ingen url',
      loginData: {
        provider: undefined,
        code: undefined,
        redirect_uri: undefined
      },
      loggingIn: false
    }

    this.loaded = this.loaded.bind(this)
    this.loginLinkedIn = this.loginLinkedIn.bind(this)
    this.loginGoogle = this.loginGoogle.bind(this)
    this.loginFacebook = this.loginFacebook.bind(this)
    this.getLinkedInData = this.getLinkedInData.bind(this)
  }

  loaded() {
    let iFrameUrl = this.iframe
      ? this.iframe.contentWindow.location.href
      : 'Ingen url'

    let mUrl = new URL(iFrameUrl)
    let urlParams = new URLSearchParams(mUrl.search)
    let authCode = urlParams.getAll('code')[0]

    this.setState({
      iframeUrl: iFrameUrl,
      loginData: Object.assign({}, this.state.loginData, {
        code: authCode
      })
    })
  }

  login(loginData) {
    let { dispatch } = this.props
    dispatch(socialLogin(loginData))

    this.setState({
      loginData: {
        provider: undefined,
        code: undefined,
        redirect_uri: undefined
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    let { loginData, loggingIn } = this.state
    let { code, provider, redirect_uri } = loginData
    if (code && provider && redirect_uri && !loggingIn) {
      this.setState({
        loggingIn: true
      })
      window.removeEventListener('message', function() {
        console.log('removed event listener')
      })
    }

    if (loggingIn && !prevState.loggingIn) {
      this.login(loginData)
    }
  }

  componentDidMount() {
    let mIframe = this.iframe
    mIframe.addEventListener('load', this.loaded)

    // Google
    $.getScript(
      'https://apis.google.com/js/client:platform.js',
      this.loadGoogle
    )

    // LinkedIn
    let liRoot = document.createElement('div')
    liRoot.id = 'linkedin-root'

    document.body.appendChild(liRoot)
    ;(function(d, s, id) {
      const element = d.getElementsByTagName(s)[0]
      const ljs = element
      let js = element
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = '//platform.linkedin.com/in.js'
      js.type = 'text/javascript'
      js.text = 'api_key: 86fnbibk2t9g4m'
      ljs.parentNode.insertBefore(js, ljs)
    })(document, 'script', 'linkedin-sdk')

    // Facebook

    window.fbAsyncInit = function() {
      FB.init({
        appId: '1021816071285498',
        cookie: true,
        xfbml: true,
        version: 'v2.10'
      })
      FB.AppEvents.logPageView()
    }
    ;(function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }

  loginFacebook() {
    // this.iframe.contentWindow.postMessage('facebook', '*')
    let _this = this
    let fbOpen =
      'https://www.facebook.com/v2.10/dialog/oauth?client_id=1021816071285498&redirect_uri=https://app.workandpassion.se/login/facebook'
    // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    //   fbOpen =
    //     'https://www.facebook.com/v2.10/dialog/oauth?client_id=1021816071285498&redirect_uri=https://app.workandpassion.se/login/facebook'
    // }
    // fbOpen = '/login'
    let fbWindow = window.open(fbOpen)

    window.addEventListener('message', function(event) {
      // IMPORTANT: Check the origin of the data!
      if (
        ~event.origin.indexOf('https://great-drawer-8513.roast.io') ||
        ~event.origin.indexOf('http://localhost:3000') ||
        ~event.origin.indexOf('https://app.workandpassion.se')
      ) {
        if (
          event.data &&
          typeof event.data === 'string' &&
          event.data !== 'HEJHEJ'
        ) {
          if (_this.state.loginData.provider !== 'linkedin-oauth2') {
            _this.setState({
              loginData: Object.assign({}, _this.state.loginData, {
                code: event.data,
                provider: 'facebook',
                redirect_uri:
                  !process.env.NODE_ENV ||
                  process.env.NODE_ENV === 'development'
                    ? 'https://app.workandpassion.se/login/facebook'
                    : 'https://app.workandpassion.se/login/facebook'
              })
            })

            fbWindow.close()
          }
        }
      } else {
        // The data hasn't been sent from your site!
        // Be careful! Do not use it.
        console.log('bad origin?')
        console.log(event.origin)
        return
      }
    })
  }

  getLinkedInData() {
    let _self = this
    IN.User.authorize(function() {
      IN.API.Profile('me')
        .fields([
          'firstName',
          'lastName',
          'formatted-name',
          'specialties',
          'headline',
          'summary',
          'positions:(company,title,summary,startDate,endDate,isCurrent)',
          'industry',
          'location:(name,country:(code))',
          'pictureUrl',
          'publicProfileUrl',
          'emailAddress',
          'educations',
          'dateOfBirth'
        ])
        .result(function(profiles) {
          // _self.setUpProfileFromLinkedIn(profiles.values[0])
          console.log('got profile from linkedIn')
          console.log(profiles)
          _self.loginLinkedIn()
        })
    })
  }

  loginLinkedIn() {
    this.setState({
      loginData: Object.assign({}, this.state.loginData, {
        provider: 'linkedin-oauth2',
        redirect_uri:
          !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/login/linkedin'
            : 'https://great-drawer-8513.roast.io/login/linkedin'
      })
    })

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      this.iframe.src =
        'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fnbibk2t9g4m&redirect_uri=http%3A%2F%2Flocalhost:3000%2Flogin%2Flinkedin&state=987654321&scope=r_emailaddress,r_basicprofile'
    } else {
      // production code
      this.iframe.src =
        'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fnbibk2t9g4m&redirect_uri=https%3A%2F%2Fgreat-drawer-8513.roast.io%2Flogin%2Flinkedin&state=987654321&scope=r_emailaddress,r_basicprofile'
    }
  }

  loginGoogle() {
    let _this = this
    gapi.auth2
      .getAuthInstance()
      .grantOfflineAccess()
      .then(authResult => {
        console.log(authResult)
        if (authResult['code']) {
          _this.setState({
            loginData: Object.assign({}, _this.state.loginData, {
              code: authResult['code'],
              provider: 'google-oauth2',
              redirect_uri: 'postmessage'
            })
          })
        }
      })
  }

  loadGoogle() {
    gapi.load('auth2', function() {
      gapi.auth2.init({
        client_id:
          '369307759639-bn22hfm88ttjg2letf87c21jkmvapldd.apps.googleusercontent.com'
        // Scopes to request in addition to 'profile' and 'email'
        // scope: 'openid'
      })
    })
  }

  render() {
    return (
      <div className="container social-login">
        <iframe
          height="1"
          width="1"
          title="Social Login"
          id="iframe_id"
          name="social_iframe"
          ref={iframe => {
            this.iframe = iframe
          }}
          style={{ opacity: 0 }}
        />

        <div className="row social justify-content-center align-items-center justify-content-center align-items-center w-100 pt-3 pb-2">
          <div onClick={this.getLinkedInData} id="linkedin-btn">
            <i className="fab fa-linkedin-in mx-4" />
            LinkedIn
          </div>
          <div onClick={this.loginFacebook} id="facebook-btn">
            <i className="fab fa-facebook" />
          </div>
          <div onClick={this.loginGoogle} id="google-btn">
            <i className="fab fa-google" />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(SocialLogin)
