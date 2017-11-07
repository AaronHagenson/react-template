import {
  TokenExpiredModal,
  mapStateToProps,
  mapDispatchToProps
} from '../../../src/components/modals/tokenExpiredModal';
import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';

describe('tokenExpiredModal', () => {
  const props = {
    showModal: true,
    reAuthHandler: () => {
    }
  };

  it('should render modal title', () => {
    //Arrange & Act
    const wrapper = shallow(<TokenExpiredModal {...props}/>);
    wrapper.setProps({showModal: true});

    //Assert
    expect(wrapper.find('Modal').length).toBe(1);
    expect(wrapper.find('Modal').node.props.show).toBe(true);
    expect(wrapper.find('ModalHeader').length).toBe(1);
    expect(wrapper.find('ModalTitle').length).toBe(1);
    expect(wrapper.find('ModalTitle').node.props.children).toBe('Session Expired');
  });

  it('should render modal body', () => {
    //Arrange & Act
    const wrapper = shallow(<TokenExpiredModal {...props}/>);
    wrapper.setProps({showModal: true});

    //Assert
    expect(wrapper.find('Modal').length).toBe(1);
    expect(wrapper.find('ModalBody').length).toBe(1);
    expect(wrapper.contains(<p>
      Your session has expired. Click continue to re-authenticate.
    </p>)).toBe(true);
  });

  it('should render modal footer', () => {
    //Arrange
    let onClickSpy = sinon.spy();

    //Act
    const wrapper = shallow(<TokenExpiredModal {...props}/>);
    wrapper.setProps({showModal: true, reAuthHandler: onClickSpy});

    //Assert
    expect(wrapper.find('Modal').length).toBe(1);
    expect(wrapper.find('ModalFooter').length).toBe(1);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('button').node.props.children).toEqual('Continue');
  });

  it('should map state to props', () => {
    const myFunc = function () {
    };

    const actual = mapStateToProps({
      token: {
        isExpired: true,
        reAuthHandler: myFunc
      }
    });
    const expected = {
      showModal: true,
      reAuthHandler: myFunc
    };

    expect(actual).toEqual(expected);
  });

  it('should return an empty dispatch object', () => {
    expect(mapDispatchToProps()).toEqual({});
  });
});
