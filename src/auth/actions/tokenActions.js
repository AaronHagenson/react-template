import {TOKEN_IS_EXPIRED} from '../constants/actionTypes';

export function tokenExpired(reAuthHandler) {
  return {
    type: TOKEN_IS_EXPIRED,
    payload: {
      reAuthHandler
    }
  };
}
