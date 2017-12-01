import React from 'react';
import * as store from '../src/store/configureStore';
import * as rrr from 'react-router-redux';
import sinon from 'sinon';

describe('index', () => {
  it('should configure the store', () => {
    let promise;
    sinon.stub(rrr, 'syncHistoryWithStore').returns({});
    sinon.stub(store, 'configureStore').callsFake(() => {
      promise = new Promise((resolve, reject) => {
        resolve({
          getState: () => {}
        });
      });
      return promise;
    });

    try {
      require('../src/index');
    } catch (e) {
      console.log('got exception');
    }

    store.configureStore.restore();
    rrr.syncHistoryWithStore.restore();
    return promise;
  });
});
