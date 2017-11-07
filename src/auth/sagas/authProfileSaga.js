import {put, call, takeEvery} from 'redux-saga/effects';
import Api from '../authProfileApi';

import {AUTH_PROFILE_RETRIEVAL_STARTED} from '../constants/actionTypes';

import {
  retrieveProfileComplete,
  retrieveProfileError
} from '../actions/authProfileActions';

export function* retrieveProfileStart() {
  try {
    const profile = yield call(Api.getAuthProfile);
    yield put(retrieveProfileComplete(profile));

  } catch (e) {
    yield put(retrieveProfileError(e));
  }
}

export function* watchAuthProfileRetrieval() {
  yield takeEvery(AUTH_PROFILE_RETRIEVAL_STARTED, retrieveProfileStart);
}
