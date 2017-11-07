import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {hashHistory} from 'react-router';

const pack = require('../../package.json');

export class AppNavbar extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="row">
        <Navbar collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">{pack.name}</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem
                eventKey={0}
                className={this.props.location === '/' && 'active'}
                onClick={this.props.navigate.bind(this, '/')}>
                Home
              </NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem>{this.props.authInfo.email}</NavItem>
              <NavItem style={{height: '0px', width: '0px'}}>
                <img
                  src={this.props.authInfo.picture}
                  className="navbar-profile-image"
                />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

AppNavbar.propTypes = {
  navigate: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  authInfo: PropTypes.object
};

export const mapStateToProps = state => {
  let pathName = '/';

  if (
    state.routing &&
    state.routing.locationBeforeTransitions &&
    state.routing.locationBeforeTransitions.pathname
  ) {
    pathName = state.routing.locationBeforeTransitions.pathname;
  }
  return {
    authInfo: state.auth,
    location: pathName
  };
};

export const mapDispatchToProps = () => {
  return {
    navigate: route => {
      hashHistory.push(route);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavbar);
