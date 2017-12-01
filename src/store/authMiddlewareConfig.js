import config from '../config/config';
import {TOKEN_IS_EXPIRED} from '../auth/constants/actionTypes';
const pack = require('../../package.json');

export const getAuthMiddlewareConfig = () => {
  // Trim off trailing slash if a second one is added
  let baseUrl = location.origin + location.pathname;
  if (baseUrl.endsWith('//')) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  return {
    domain: config.getConfig().oAuthDomain,
    clientID: config.getConfig().oAuthClientId,
    authConnection: config.getConfig().oAuthConnection,
    audience: config.getConfig().oAuthAudience,
    actionsWhitelist: [TOKEN_IS_EXPIRED],
    storagePrefix: pack.name,
    baseUrl
  };
};
