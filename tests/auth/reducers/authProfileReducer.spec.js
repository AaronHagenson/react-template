import authProfileReducer from '../../../src/auth/reducers/authProfileReducer';
import * as types from '../../../src/auth/constants/actionTypes';
import toastr from 'toastr';
import sinon from 'sinon';

describe('authProfileReducer', () => {
  it('should return initial state', () => {
    const expectedState = {};

    expect(authProfileReducer(undefined, {})).toEqual(expectedState);
  });

  it('should return profile for AUTH_PROFILE_RETRIEVAL_COMPLETED action', () => {
    const profile = {
      given_name: 'John',
      family_name: 'Snow'
    };
    const action = {
      type: types.AUTH_PROFILE_RETRIEVAL_COMPLETED,
      payload: {
        profile: profile
      }
    };
    const expected = {
      given_name: 'John',
      family_name: 'Snow',
      email: 'John.Snow@chrobinson.com'
    };

    expect(authProfileReducer([], action)).toEqual(expected);
  });

  it('should toast an error for AUTH_PROFILE_RETRIEVAL_ERROR action', () => {
    sinon.spy(toastr, 'error');

    const action = {
      type: types.AUTH_PROFILE_RETRIEVAL_ERROR,
      payload: {
        error: 'error message'
      }
    };
    authProfileReducer([], action);

    expect(toastr.error.callCount).toBe(1);
  });
});
