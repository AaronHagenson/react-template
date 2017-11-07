import * as actions from '../../../src/auth/actions/authProfileActions';
import * as types from '../../../src/auth/constants/actionTypes';

describe('authProfileActions', () => {
  describe('retrieveProfile', () => {
    it('should return profile retrieval started action', () => {
      const expectedAction = {
        type: types.AUTH_PROFILE_RETRIEVAL_STARTED
      };

      expect(actions.retrieveProfile()).toEqual(expectedAction);
    });
  });

  describe('retrieveProfileComplete', () => {
    it('should return a profile on completion', () => {
      const profile = 'Test Profile';
      const expectedAction = {
        type: types.AUTH_PROFILE_RETRIEVAL_COMPLETED,
        payload: {
          profile
        }
      };

      expect(actions.retrieveProfileComplete(profile)).toEqual(expectedAction);
    });
  });

  describe('retrieveProfileError', () => {
    it('should return an error', () => {
      const error = 'Test Error';
      const expectedAction = {
        type: types.AUTH_PROFILE_RETRIEVAL_ERROR,
        payload: {
          error
        }
      };

      expect(actions.retrieveProfileError(error)).toEqual(expectedAction);
    });
  });
});
