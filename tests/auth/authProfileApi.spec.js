import AuthProfileApi from '../../src/auth/authProfileApi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as Auth from '../../src/auth/auth0Middleware';
import sinon from 'sinon';
import config from '../../src/config/config';

describe('authProfileApi', () => {
  let getAccessTokenStub;
  let mockAdapter;
  let configStub;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
    getAccessTokenStub = sinon.stub(Auth, 'getAccessToken').returns('123');
    configStub = sinon.stub(config, 'getConfig').returns({
      oAuthApiEndpoint: ''
    });
  });

  afterEach(() => {
    getAccessTokenStub.restore();
    mockAdapter.restore();
    configStub.restore();
  });

  it('should get the auth profile', () => {
    mockAdapter.onPost('/userinfo').reply(() => {
      return [200, {auth: 'profile'}];
    });

    return AuthProfileApi.getAuthProfile().then(response => {
      expect(response.auth).toEqual('profile');
    });
  });

  it('should return an error', () => {
    mockAdapter.onPost('/userinfo').reply(() => {
      return [500, null];
    });
    return AuthProfileApi.getAuthProfile().catch(error => {
      expect(error).toEqual(
        'Error getting auth profile information Error: Request failed with status code 500'
      );
    });
  });
});
