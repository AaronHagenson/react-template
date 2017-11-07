import React from 'react';
import HomePage from '../../src/components/homePage';
import {shallow} from 'enzyme';

describe('homePage', () => {
  it('should render homepage', () => {
    const wrapper = shallow(<HomePage />);

    expect(wrapper.contains('Hello, World!')).toBe(true);
  });
});
