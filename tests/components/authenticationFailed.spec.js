import React from 'react';
import AuthenticationFailed from '../../src/components/authenticationFailed';
import {shallow} from 'enzyme';
import { Modal } from 'react-bootstrap';

describe('AuthenticationFailed', () => {
    it('should display authentication failure with default message for unknown error type', () => {
      const wrapper = shallow(<AuthenticationFailed error={ { error: '' } } />);

      expect(wrapper.find(Modal.Title).children().text()).toMatch(/authentication failed/gi);
      expect(wrapper.find('p').children().text()).toMatch(/unknown error/gi);
    });

    it('should map error codes to corresponding messages', () => {
      const error = {
        error: 'too_many_attempts'
      };

      const wrapper = shallow(<AuthenticationFailed error={ error } />);

      expect(wrapper.find(Modal.Title).children().text()).toMatch(/locked/gi);
      expect(wrapper.find('p').children().text()).toMatch(/too many failed attempts/gi);

      error.error = 'invalid_user_password';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/authentication failure/gi);
      expect(wrapper.find('p').children().text()).toMatch(/username or password/gi);

      error.error = 'access_denied';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/access denied/gi);
      expect(wrapper.find('p').children().text()).toMatch(/not authorized.*myQ/gi);

      error.error = 'unauthorized_client';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/permission denied/gi);
      expect(wrapper.find('p').children().text()).toMatch(/permissions.*myQ/gi);

      error.error = 'server_error';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/connection failure/gi);
      expect(wrapper.find('p').children().text()).toMatch(/server was unavailable.*myQ/gi);

      error.error = 'temporarily_unavailable';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/unavailable/gi);
      expect(wrapper.find('p').children().text()).toMatch(/high traffic or maintenance.*myQ/gi);

      error.error = 'invalid_scope';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/unable to process/gi);
      expect(wrapper.find('p').children().text()).toMatch(/verify the correct request/gi);

      error.error = 'unsupported_response_type';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/unsupported request/gi);
      expect(wrapper.find('p').children().text()).toMatch(/does not support this request/gi);

      error.error = 'invalid_request';
      wrapper.setProps({ error });
      expect(wrapper.find(Modal.Title).children().text()).toMatch(/authentication failure/gi);
      expect(wrapper.find('p').children().text()).toMatch(/verify the correct request/gi);
    });
  });
