import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import 'babel-polyfill';
import createSagaMiddleware from 'redux-saga';
import auth0 from '../auth/auth0Middleware';
import rootReducer from '../reducers';
import sagas from '../sagas';
import config from '../config/config';
import {TOKEN_IS_EXPIRED} from '../auth/constants/actionTypes';
import {tokenExpired} from '../auth/actions/tokenActions';

const pack = require('../../package.json');
const sagaMiddleware = createSagaMiddleware();

export const getAuthMiddlewareConfig = () => {
  // Trim off trailing slash if a second one is added
  let baseUrl = window.location.origin + window.location.pathname;
  if (baseUrl.endsWith('//')) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  return {
    domain: config.getConfig().oAuthDomain,
    clientID: config.getConfig().oAuthClientId,
    authConnection: config.getConfig().oAuthConnection,
    audience: config.getConfig().oAuthAudience,
    actionsWhitelist: [
      TOKEN_IS_EXPIRED
    ],
    storagePrefix: pack.name,
    baseUrl
  };
};

export function configureStoreProd(initialState) {
  const authConfig = getAuthMiddlewareConfig();
  const middlewares = [
    sagaMiddleware,
    auth0(authConfig)
    // Add other middleware on this line...
  ];

  let store = {};
  authConfig.tokenExpiredHandler = reAuth => {
    store.dispatch(tokenExpired(reAuth));
  };

  store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
  ));

  // as of redux-saga 0.10.0, you can't pass a sagas function into the createSagaMiddleware
  // function. instead .run(... ) must be called
  sagaMiddleware.run(sagas);

  return store;
}

export function configureStoreDev(initialState) {
  const authConfig = getAuthMiddlewareConfig();
  const middlewares = [
    sagaMiddleware,
    auth0(authConfig),
    // Add other middleware on this line...

    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant()
  ];

  // add support for Redux dev tools
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  let store = {};
  authConfig.tokenExpiredHandler = reAuth => {
    store.dispatch(tokenExpired(reAuth));
  };

  store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares)
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // eslint-disable-line global-require
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  // as of redux-saga 0.10.0, you can't pass a sagas function into the createSagaMiddleware
  // function. instead .run(... ) must be called
  sagaMiddleware.run(sagas);

  return store;
}

export function configureStore(initialState) {
  return new Promise((resolve, reject) => {
    config.loadConfiguration()
      .then(() => {
        if (process.env.NODE_ENV === 'production') {
          resolve(configureStoreProd(initialState));
        } else {
          resolve(configureStoreDev(initialState));
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
