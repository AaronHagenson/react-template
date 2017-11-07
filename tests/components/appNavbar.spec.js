import {
  AppNavbar,
  mapStateToProps,
  mapDispatchToProps
} from '../../src/components/appNavbar';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

describe('AppNavbar', () => {
  const defaultProps = {
    navigate: () => {},
    location: '/',
    authInfo: {
      email: 'test@test.com'
    }
  };

  it('should display app name', () => {
    const wrapper = shallow(<AppNavbar {...defaultProps} />);

    expect(wrapper.find('NavbarHeader').length).toBe(1);
    expect(wrapper.find('NavbarBrand').length).toBe(1);
  });

  describe('mapStateToProps', () => {
    it('should map props', () => {
      const state = {
        routing: {
          locationBeforeTransitions: {
            pathname: '/location'
          }
        },
        auth: {
          name: 'Test User',
          email: 'test@test.com'
        }
      };
      const actual = mapStateToProps(state);
      const expected = {
        authInfo: {
          name: 'Test User',
          email: 'test@test.com'
        },
        location: '/location'
      };

      expect(actual).toEqual(expected);
    });

    it('should map default pathName', () => {
      const state = {
        auth: {}
      };
      const actual = mapStateToProps(state);
      const expected = {
        authInfo: {},
        location: '/'
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('mapDispatchToProps', () => {
    const router = require('react-router');
    const history = router.hashHistory;
    sinon.stub(history, 'push').callsFake(() => {});

    const props = mapDispatchToProps();

    expect(props.navigate).toBeDefined();

    props.navigate('test');

    expect(history.push.calledOnce).toBe(true);
    history.push.restore();
  });
});
