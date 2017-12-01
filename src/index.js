import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {hashHistory, Router} from 'react-router';
import routes from './routes';
import * as store from './store/configureStore';
import * as rrr from 'react-router-redux';
import './styles/styles.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/font-awesome/css/font-awesome.css';
import '../node_modules/toastr/toastr.scss';

require('./favicon.ico');

store
  .configureStore()
  .then(store => {
    // Create an enhanced history that syncs navigation events with the store
    const history = rrr.syncHistoryWithStore(hashHistory, store);

    render(
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>,
      document.getElementById('app')
    );
  })
  .catch(err => {
    // Catch block exists to avoid an unhandled promise rejection in
    // unit tests. Nothing will be shown if the dom fails to render.
  });
