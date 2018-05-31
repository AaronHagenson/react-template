import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

const defaultMessage = 'An unknown error occurred. Please try again later.';
const messageMap = {
  'access_denied': 'You are not authorized to access the sytem. Go to myQ to request access.',
  'invalid_request': 'Unable to process the request. Verify the correct request is being used  and is properly formatted.',
  'unauthorized_client': 'You do not have the correct permissions to access the system. Go to myQ to request access.',
  'server_error': 'Attempt to sign in failed because the server was unavailable or unable to respond. Try again. If problem persists go to myQ to report the problem.',
  'invalid_scope': 'Verify the correct request is being used and is properly formatted.',
  'temporarily_unavailable': 'Due to high traffic or maintenance the system was unable to respond to the request. Wait and try again. If the problem persists, go to myQ to report the problem.',
  'unsupported_response_type': 'Authorization server does not support this request.',
  'too_many_attempts': 'Account has been locked because of too many failed attempts. Go to myQ or contact service desk to reset account.',
  'invalid_user_password': 'Username or password was invalid'
};

const defaultHeading = 'User authentication failed';
const headingMap = {
  'access_denied': 'Access denied',
  'invalid_request': 'Authentication failure',
  'unauthorized_client': 'Permission denied',
  'server_error': 'Connection failure',
  'invalid_scope': 'Unable to process request',
  'temporarily_unavailable': 'Server temporarily unavailable',
  'unsupported_response_type': 'Unsupported request',
  'too_many_attempts': 'Account is locked',
  'invalid_user_password': 'Authentication failure'
};

const errorHeading = err => {
  return headingMap[err.error] || defaultHeading;
};

const errorMessage = err => {
  return messageMap[err.error] || defaultMessage;
};

const AuthenticationFailed = props =>
  <Modal show>
    <Modal.Header>
      <Modal.Title>{errorHeading(props.error)}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{errorMessage(props.error)}</p>
    </Modal.Body>
  </Modal>
  ;

AuthenticationFailed.propTypes = {
  error: PropTypes.shape({
    error: PropTypes.string.required
  })
};

export default AuthenticationFailed;
