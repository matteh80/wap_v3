import React from 'react'
import { Container, Row, Col } from 'reactstrap'

class Footer extends React.Component {
  render() {
    const pjson = require('../../../package.json')

    return (
      <footer id="footer">
        <Container>
          <Row>
            <Col xs={12} md={6} className="text-center text-md-left">
              <span>Copyright 2018 Work and Passion</span>
            </Col>
            <Col xs={12} md={6} className="text-center text-md-right">
              <span>WAP v{pjson.version}</span>
            </Col>
          </Row>
        </Container>
      </footer>
    )
  }
}

export default Footer
