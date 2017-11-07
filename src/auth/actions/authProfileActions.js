import * as types from '../constants/actionTypes';

export function retrieveProfile() {
  return {
    type: types.AUTH_PROFILE_RETRIEVAL_STARTED
  };
}

export function retrieveProfileComplete(profile) {
  return {
    type: types.AUTH_PROFILE_RETRIEVAL_COMPLETED,
    payload: {
      profile
    }
  };
}

export function retrieveProfileError(error) {
  return {
    type: types.AUTH_PROFILE_RETRIEVAL_ERROR,
    payload: {
      error
    }
  };
}
