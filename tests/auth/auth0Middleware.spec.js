import middleware, {
  reAuth,
  getAccessToken,
  handleExpiredToken
} from '../../src/auth/auth0Middleware';
import sinon from 'sinon';
import projectConfig from '../../src/config/config';

describe('auth0Middleware', () => {
  const defaultConfig = {
    domain: 'test',
    clientID: 'test',
    storagePrefix: 'test',
    tokenExpiredHandler: () => {},
    actionsWhitelist: ['TEST_ACTION']
  };

  const getState = () => {
    return {
      routing: {
        locationBeforeTransitions: {
          pathname: 'test'
        }
      }
    };
  };

  it('should exist', () => {
    expect(middleware).toBeDefined();
  });

  describe('auth0MiddlewareFactory', () => {
    const utilities = require('../../src/auth/auth0Utilities');
    let currentTokenIsOkMock;
    let getPathNameMock;
    let tokenExpiredHandlerSpy;

    beforeEach(() => {
      getPathNameMock = sinon.stub(utilities, 'getPathName').callsFake(() => {
        return 'path';
      });
      tokenExpiredHandlerSpy = sinon.spy(defaultConfig, 'tokenExpiredHandler');
    });

    afterEach(() => {
      if (currentTokenIsOkMock) {
        currentTokenIsOkMock.restore();
      }
      if (getPathNameMock) {
        getPathNameMock.restore();
      }
      tokenExpiredHandlerSpy.restore();
    });

    it('should return middleware', () => {
      const mdware = middleware(defaultConfig);
      expect(mdware).toBeDefined();
    });

    it('should return next action for whitelisted action if token not ok', () => {
      currentTokenIsOkMock = sinon
        .stub(utilities, 'currentTokenIsOk')
        .callsFake(() => {
          return {
            isOk: false,
            isExpired: false
          };
        });

      const mdware = middleware(defaultConfig);
      const next = mdware({getState});
      const action = next(() => {});
      action({type: 'TEST_ACTION'});

      expect(defaultConfig.tokenExpiredHandler.callCount).toBe(0);
    });

    it('should call tokenExpiredHandler if token is expired', () => {
      let prom;
      currentTokenIsOkMock = sinon
        .stub(utilities, 'currentTokenIsOk')
        .callsFake(() => {
          prom = new Promise(resolve => {
            resolve({
              isOk: false,
              isExpired: true
            });
          });
          return prom;
        });

      const mdware = middleware(defaultConfig);
      const next = mdware({getState});
      const action = next(() => {});
      action({type: 'OTHER_ACTION'});

      prom.then(() => {
        expect(defaultConfig.tokenExpiredHandler.calledOnce).toBe(true);
      });

      return prom;
    });

    it('should return next action if everything is ok', () => {
      let prom;
      currentTokenIsOkMock = sinon
        .stub(utilities, 'currentTokenIsOk')
        .callsFake(() => {
          prom = new Promise(resolve => {
            resolve({
              isOk: true,
              isExpired: false
            });
          });
          return prom;
        });

      const mdware = middleware(defaultConfig);
      const next = mdware({getState});
      const action = next(() => {});
      action({type: 'OTHER_ACTION'});

      prom.then(() => {
        expect(defaultConfig.tokenExpiredHandler.callCount).toBe(0);
      });
      return prom;
    });
  });

  describe('handleExpiredToken', () => {
    const utilities = require('../../src/auth/auth0Utilities');
    const auth0Factory = require('../../src/auth/auth0Factory');
    let tokenExpiredHandlerSpy;
    let setAuthInfoStub;
    let setAuthRedirectPathStub;
    let loginStub;
    let configStub;

    beforeEach(() => {
      tokenExpiredHandlerSpy = sinon.spy(defaultConfig, 'tokenExpiredHandler');
      setAuthInfoStub = sinon
        .stub(utilities, 'setAuthInfo')
        .callsFake(() => {});
      setAuthRedirectPathStub = sinon
        .stub(utilities, 'setAuthRedirectPath')
        .callsFake(() => {});
      loginStub = sinon.stub(auth0Factory, 'createAuth').callsFake(() => {
        return {
          authorize: () => {}
        };
      });
      configStub = sinon.stub(projectConfig, 'getConfig').callsFake(() => {
        return {
          absoluteRoot: ''
        };
      });
    });

    afterEach(() => {
      tokenExpiredHandlerSpy.restore();
      setAuthInfoStub.restore();
      setAuthRedirectPathStub.restore();
      loginStub.restore();
      configStub.restore();
    });

    it('should call tokenExpiredHandler when expired if handler exists', () => {
      const tokenOkResult = {
        isOk: true,
        isExpired: true
      };

      middleware(defaultConfig);
      handleExpiredToken(defaultConfig, tokenOkResult, 'path');

      expect(defaultConfig.tokenExpiredHandler.callCount).toBe(1);
      expect(auth0Factory.createAuth.callCount).toBe(1);
    });

    it('should not call tokenExpiredHandler when expired if handler dne', () => {
      const tokenOkResult = {
        isOk: true,
        isExpired: true
      };

      middleware(defaultConfig);
      handleExpiredToken({authConnection: ''}, tokenOkResult, 'path');

      expect(defaultConfig.tokenExpiredHandler.callCount).toBe(0);
      expect(auth0Factory.createAuth.callCount).toBe(1);
    });

    it('should call reAuth if token was not expired but was missing', () => {
      const tokenOkResult = {
        isOk: false,
        isExpired: false
      };

      middleware(defaultConfig);
      handleExpiredToken(defaultConfig, tokenOkResult, 'path');

      expect(defaultConfig.tokenExpiredHandler.callCount).toBe(0);
      expect(auth0Factory.createAuth.callCount).toBe(1);
    });

    it('should reAuth with authConnection and pathName', () => {
      const tokenOkResult = {
        isOk: false,
        isExpired: true
      };
      const config = {
        tokenExpiredHandler: callback => {
          callback();
        },
        authConnection: 'auth connection'
      };
      sinon.spy(config, 'tokenExpiredHandler');

      middleware(config);
      handleExpiredToken(config, tokenOkResult, 'path');

      expect(config.tokenExpiredHandler.callCount).toBe(1);
      config.tokenExpiredHandler.restore();
    });
  });

  describe('reAuth', () => {
    it('should call utility functions and get an auth instance', () => {
      sinon.stub(projectConfig, 'getConfig').callsFake(() => {
        return {
          absoluteRoot: '/'
        };
      });

      const utilities = require('../../src/auth/auth0Utilities');
      const auth0Factory = require('../../src/auth/auth0Factory');
      const setAuthInfo = sinon
        .stub(utilities, 'setAuthInfo')
        .callsFake(() => {});
      const setAuthRedirectPath = sinon
        .stub(utilities, 'setAuthRedirectPath')
        .callsFake(() => {});
      const auth0Mock = sinon.stub(auth0Factory, 'createAuth').callsFake(() => {
        return {
          authorize: () => {}
        };
      });
      const config = {
        domain: 'test',
        clientID: 'test',
        tokenExpiredHandler: () => {}
      };
      middleware(config);
      reAuth(
        {
          authConnection: '',
          audience: ''
        },
        ''
      );

      expect(setAuthInfo.calledOnce).toBe(true);
      expect(setAuthRedirectPath.calledOnce).toBe(true);
      setAuthInfo.restore();
      setAuthRedirectPath.restore();
      auth0Mock.restore();
      projectConfig.getConfig.restore();
    });
  });

  describe('getAccessToken', () => {
    it('should get access token', () => {
      const storage = require('../../src/auth/localUtilities');
      const localStorageGetter = sinon
        .stub(storage, 'localStorageGetter')
        .callsFake(() => {
          return {
            getItem: () => {
              return JSON.stringify({accessToken: 'test'});
            }
          };
        });

      const token = getAccessToken();
      localStorageGetter.restore();

      expect(token).toBe('test');
    });
  });
});
