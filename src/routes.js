import React from 'react';
import {Route, IndexRoute} from 'react-router';

import AppMain from './components/app';
import HomePage from './components/homePage';
import NotFoundPage from './components/notFoundPage';

export default (
  <Route path="/" component={AppMain}>
    <IndexRoute component={HomePage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
