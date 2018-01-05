import * as utils from './localUtilities';

const accessTokenHashKey = 'access_token=';

export const getAuthInfo = storageKey => {
  const strAuthInfo = utils.localStorageGetter().getItem(storageKey);
  return JSON.parse(strAuthInfo);
};

export const setAuthInfo = (storageKey, authInfo) => {
  const localStorage = utils.localStorageGetter();
  localStorage.setItem(storageKey, authInfo);
};

export const getAuthRedirectPath = storageKey => {
  const sessionStorage = utils.sessionStorageGetter();
  return sessionStorage.getItem(storageKey);
};

export const setAuthRedirectPath = (storageKey, pathName) => {
  const sessionStorage = utils.sessionStorageGetter();

  if (!utils.isNullOrEmpty(pathName)) {
    sessionStorage.setItem(storageKey, pathName);
  }
};

export const removeAuthRedirectPath = storageKey => {
  const sessionStorage = utils.sessionStorageGetter();
  return sessionStorage.removeItem(storageKey);
};

export const tokenIsExpired = authInfo => {
  const expDate = new Date(authInfo.exp);
  const utcNow = new Date();
  return utcNow >= expDate;
};

export const redirectToOriginalPath = (redirectPath, config) => {
  // if redirect path is undefined, null or empty string
  if (utils.isNullOrEmpty(redirectPath)) {
    // set to empty string so concat is valid
    redirectPath = '';
  }

  // navigate to original request location
  Object.defineProperty(global.window.location, 'href', {
    writable: true,
    value: `${config.baseUrl}${redirectPath}`
  });
};

export const getPathName = (action, state) => {
  let pathName = '';

  if (action.type && action.type.startsWith('@@router')) {
    pathName = action.payload.pathname;
  } else if (state.routing && state.routing.locationBeforeTransitions) {
    pathName = state.routing.locationBeforeTransitions.pathname;
  }

  return pathName;
};

export const currentTokenIsOk = (authInfoKey, redirectKey, auth, config) => {
  return new Promise(resolve => {
    let authInfo = getAuthInfo(authInfoKey);
    let tokenIsOk = false;
    let isExpired = false;

    // localStorage always returns a default value of null if no key is found
    if (authInfo !== null && !authInfo.error) {
      // token is ok only if token is not expired
      isExpired = tokenIsExpired(authInfo);
      tokenIsOk = !isExpired;
    }

    if (isExpired || tokenIsOk) {
      resolve({
        isOk: tokenIsOk,
        isExpired
      });
    } else {
      // no local authInfo found
      // check for auth token in window hash
      // if no is found there, no go
      const hash = utils.getWindowHash();

      if (hash.includes(accessTokenHashKey)) {
        auth.parseHash(hash, (err, result) => {
          const exp = new Date();
          exp.setSeconds(exp.getSeconds() + result.expiresIn);

          Object.assign(result, {
            exp
          });

          setAuthInfo(authInfoKey, JSON.stringify(result));

          // if there is no result or there's a result with an error
          // the token is not ok
          tokenIsOk = !(!result || err);

          // this checks to make sure an expired token isn't being loaded into the app
          authInfo = getAuthInfo(authInfoKey);
          isExpired = tokenIsExpired(authInfo);

          if (!isExpired && tokenIsOk) {
            const redirectPath = getAuthRedirectPath(redirectKey);
            removeAuthRedirectPath(redirectKey);

            redirectToOriginalPath(redirectPath, config);
          }

          resolve({
            isOk: tokenIsOk,
            isExpired
          });
        });
      } else {
        resolve({
          isOk: false,
          isExpired: false
        });
      }
    }
  });
};
