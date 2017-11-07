import {
  App,
  mapStateToProps,
  mapDispatchToProps
} from '../../src/components/app';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

describe('App', () => {
  const props = {
    children: <div>Test</div>,
    retrieveProfile: () => {}
  };

  it('should render', () => {
    const wrapper = shallow(<App {...props} />);

    expect(
      wrapper
        .find('div')
        .at(0)
        .hasClass('container-fluid')
    ).toBe(true);
    expect(
      wrapper
        .find('div')
        .at(1)
        .hasClass('navbar-spacer')
    ).toBe(true);
  });

  it('should retrieveProfile on mount', () => {
    sinon.spy(props, 'retrieveProfile');
    shallow(<App {...props} />);

    expect(props.retrieveProfile.callCount).toBe(1);
    props.retrieveProfile.restore();
  });

  describe('mapStateToProps', () => {
    it('should return empty props', () => {
      const props = mapStateToProps();

      expect(props).toEqual({});
    });
  });

  describe('mapDispatchToProps', () => {
    it('should map retrieveProfile', () => {
      const actions = require('../../src/auth/actions/authProfileActions');
      const retrieveStub = sinon
        .stub(actions, 'retrieveProfile')
        .callsFake(() => {
          return '123';
        });
      const dispatch = arg => {
        return arg;
      };
      const props = mapDispatchToProps(dispatch);
      props.retrieveProfile();

      expect(actions.retrieveProfile.calledOnce).toBe(true);
      retrieveStub.restore();
    });
  });
});
