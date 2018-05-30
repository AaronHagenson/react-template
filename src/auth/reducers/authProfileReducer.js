import * as types from '../constants/actionTypes';
import toastr from 'toastr';
import clone from '../../utils/deepClone';

const initialState = {
  auth: {}
};

export default function update(state = initialState.auth, action) {
  let profile;
  switch (action.type) {
    case types.AUTH_PROFILE_RETRIEVAL_COMPLETED:
      profile = clone(action.payload.profile);
      profile.email = `${profile.given_name}.${profile.family_name}@chrobinson.com`;
      return profile;

    case types.AUTH_PROFILE_RETRIEVAL_ERROR:
      toastr.error('Failed to retrieve auth0 profile!');
      return state;

    default:
      return state;
  }
}
