import React from 'react';
import { AuthenticationFailed, 
         mapStateToProps, 
         mapDispatchToProps } from '../../src/components/authenticationFailed';
import {shallow} from 'enzyme';


describe('AuthenticationFailed', () => {
    const defaultProps = {
      
    };
  
    it('should display authentication failiure', () => {
      const wrapper = shallow(<AuthenticationFailed {...defaultProps} />);
  
      expect(wrapper.find('AuthenticationFailed').length).toBe(1);
      //expect(wrapper.find('NavbarBrand').length).toBe(1);
    });
  
    
  });
