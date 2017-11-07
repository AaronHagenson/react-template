import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Modal} from 'react-bootstrap';

export class TokenExpiredModal extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Modal show={this.props.showModal}>
        <Modal.Header>
          <Modal.Title>Session Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your session has expired. Click continue to re-authenticate.</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn" onClick={this.props.reAuthHandler}>
            Continue
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TokenExpiredModal.propTypes = {
  showModal: PropTypes.bool,
  reAuthHandler: PropTypes.func
};

export const mapStateToProps = state => {
  return {
    showModal: state.token.isExpired,
    reAuthHandler: state.token.reAuthHandler
  };
};

export const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenExpiredModal);
