import {put, call, takeEvery} from 'redux-saga/effects';
import api from '../../../src/auth/authProfileApi';
import * as saga from '../../../src/auth/sagas/authProfileSaga';
import * as actions from '../../../src/auth/actions/authProfileActions';
import * as types from '../../../src/auth/constants/actionTypes';

describe('authProfileSaga', () => {
  describe('retrieveProfileStart', () => {
    const profile = {
      sub: 'thing1|thing2|NAME@chrobinson.com',
      name: 'John Snow',
      picture: 'url'
    };
    const transformedProfile = {
      sub: 'thing1|thing2|NAME@chrobinson.com',
      name: 'John Snow',
      email: 'name@chrobinson.com',
      sevenLetter: 'NAME',
      picture: 'url'
    };
    const error = 'Error message';

    it('should call retrieveProfileComplete', () => {
      const generator = saga.retrieveProfileStart();

      let next = generator.next(profile);
      let actual = next.value;
      let expected = call(api.getAuthProfile);

      expect(actual).toEqual(expected);

      next = generator.next(transformedProfile);
      actual = next.value;
      expected = put(actions.retrieveProfileComplete(transformedProfile));
      expect(actual).toEqual(expected);
    });

    it('should call retrieveProfileError', () => {
      const generator = saga.retrieveProfileStart();

      let next = generator.next(profile);
      let actual = next.value;
      let expected = call(api.getAuthProfile);

      expect(actual).toEqual(expected);

      next = generator.throw(error);
      actual = next.value;
      expected = put(actions.retrieveProfileError(error));

      expect(actual).toEqual(expected);
    });
  });

  describe('watchAuthProfileRetrieval', () => {
    it('should call retrieveProfileStart', () => {
      const generator = saga.watchAuthProfileRetrieval();
      const expected = takeEvery(
        types.AUTH_PROFILE_RETRIEVAL_STARTED,
        saga.retrieveProfileStart
      );
      const actual = generator.next().value;

      expect(actual).toEqual(expected);
    });
  });
});
