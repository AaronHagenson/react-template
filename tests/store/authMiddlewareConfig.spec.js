import * as store from '../../src/store/authMiddlewareConfig';
import sinon from 'sinon';
import config from '../../src/config/config';
const location = window.location;

describe('getAuthMiddlewareConfig', () => {
  let configMock;

  beforeEach(() => {
    configMock = sinon.stub(config, 'getConfig').callsFake(() => {
      return {
        oAuthClientId: 'test id',
        oAuthDomain: 'test domain',
        oAuthConnection: 'chr test',
        oAuthAudience: 'test audience'
      };
    });
  });

  afterEach(() => {
    configMock.restore();
  });

  it('should load config', () => {
    const actual = store.getAuthMiddlewareConfig();

    expect(actual).toEqual({
      domain: 'test domain',
      clientID: 'test id',
      authConnection: 'chr test',
      audience: 'test audience',
      actionsWhitelist: ['TOKEN_IS_EXPIRED'],
      storagePrefix: 'react-slingshot',
      baseUrl: 'nullblank'
    });
  });

  it('should trim baseUrl', () => {
    Object.defineProperty(window.location, 'pathname', {
      writable: true,
      value: 'some url'
    });

    window.location.pathname = 'test//';

    const actual = store.getAuthMiddlewareConfig();
    expect(actual.baseUrl).toBe('nulltest/');

    Object.defineProperty(window.location, 'pathname', {
      writable: false,
      value: 'blank'
    });
  });
});
