import {all} from 'redux-saga/effects';
import * as authProfile from '../auth/sagas/authProfileSaga';

export default function* root() {
  yield all([
    authProfile.watchAuthProfileRetrieval()
    // Add additional sagas here
  ]);
}
