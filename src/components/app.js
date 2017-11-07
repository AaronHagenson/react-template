import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {retrieveProfile} from '../auth/actions/authProfileActions';
import ExpiredModal from './modals/tokenExpiredModal';
import Navbar from './appNavbar';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
export class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.props.retrieveProfile();
  }

  render() {
    return (
      <div className="container-fluid">
        <Navbar />
        <div className="navbar-spacer" />
        <ExpiredModal />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  retrieveProfile: PropTypes.func.isRequired
};

export const mapStateToProps = () => {
  return {};
};

export const mapDispatchToProps = dispatch => {
  return {
    retrieveProfile: () => {
      dispatch(retrieveProfile());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
