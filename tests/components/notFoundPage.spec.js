import React from 'react';
import NotFoundPage from '../../src/components/notFoundPage';
import {shallow} from 'enzyme';

describe('notFoundPage', () => {
  it('should show a 404 page not found error', () => {
    const wrapper = shallow(<NotFoundPage />);

    expect(wrapper.find('h4').node.props.children).toBe('404 Page Not Found');
  });
});
