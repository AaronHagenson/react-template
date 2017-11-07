// this file will become an npm package as soon as DevOps is ready to support
// repo's being published out to our npm server
import * as utilities from './auth0Utilities';
import * as storage from './localUtilities';
import {
  createAuth
} from './auth0Factory';

const authInfoStorageKeySuffix = 'auth';
const authRedirectRouteStorageKeySuffix = 'authRedirectRoute';

let authInfoStorageKey = 'auth';
let authRedirectRouteStorageKey = 'authRedirectRoute';
let _auth0;

export const auth0MiddlewareFactory = config => {
  // initialize auth0 lib
  _auth0 = createAuth({
    domain: config.domain,
    clientID: config.clientID
  });

  const actionsWhitelist = Array.isArray(config.actionsWhitelist) ? config.actionsWhitelist : [];

  if (config.storagePrefix) {
    authInfoStorageKey = config.storagePrefix + '.' + authInfoStorageKeySuffix;
    authRedirectRouteStorageKey = config.storagePrefix + '.' + authRedirectRouteStorageKeySuffix;
  }

  return function ({
                     getState
                   }) {
    return next => {
      return action => {
        if (actionsWhitelist.includes(action.type)) {
          return next(action);
        } else {

          // check the state of the current token
          const tokenOkResult = utilities.currentTokenIsOk(authInfoStorageKey,
            authRedirectRouteStorageKey, _auth0, config);

          // if something is not ok
          if (!tokenOkResult.isOk) {

            // get the auth redirect pathName
            let pathName = utilities.getPathName(action, getState());

            handleExpiredToken(config, tokenOkResult, pathName);
          } else {
            return next(action);
          }
        }
      };
    };
  };
};

export function handleExpiredToken(config, tokenOkResult, pathName) {
  // if token is expired
  if (tokenOkResult.isExpired) {
    // if a handler was provided for token exp., invoke it
    if (config.tokenExpiredHandler) {
      const _reAuth = () => {
        reAuth(config, pathName);
      };

      config.tokenExpiredHandler(_reAuth);
    } else {
      reAuth(config, pathName);
    }

  } else {
    // if our current token was missing
    reAuth(config, pathName);
  }
}

export function reAuth(config, redirectPath) {
  utilities.setAuthInfo(authInfoStorageKey, null);
  utilities.setAuthRedirectPath(authRedirectRouteStorageKey, redirectPath);

  _auth0.authorize({
    connection: config.authConnection,
    audience: config.audience,
    responseType: 'token',
    scope: 'openid profile',
    redirectUri: config.baseUrl
  });
}

// for use in api calls
export function getAccessToken() {
  const localStorage = storage.localStorageGetter();
  const strAuthInfo = localStorage.getItem(authInfoStorageKey);
  const authInfo = JSON.parse(strAuthInfo);
  return authInfo.accessToken;
}

export default auth0MiddlewareFactory;
