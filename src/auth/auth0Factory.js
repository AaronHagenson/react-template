import auth0 from 'auth0-js';

export const createAuth = config => {
  return new auth0.WebAuth(config);
};
