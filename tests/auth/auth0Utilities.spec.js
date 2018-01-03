import * as authUtils from '../../src/auth/auth0Utilities';
import sinon from 'sinon';

describe('auth0Utilities', () => {
  describe('getters and setters', () => {
    const utils = require('../../src/auth/localUtilities');
    const localStorageFunctions = {
      getItem: () => {
        return JSON.stringify({
          test: 'test string 1'
        });
      },
      setItem: () => {}
    };
    const sessionStorageFunctions = {
      getItem: () => {
        return JSON.stringify('test string 2');
      },
      setItem: () => {},
      removeItem: () => {}
    };

    let localStorageMock;
    let sessionStorageMock;

    beforeEach(() => {
      localStorageMock = sinon
        .stub(utils, 'localStorageGetter')
        .callsFake(() => {
          return localStorageFunctions;
        });
      sessionStorageMock = sinon
        .stub(utils, 'sessionStorageGetter')
        .callsFake(() => {
          return sessionStorageFunctions;
        });
    });

    afterEach(() => {
      localStorageMock.restore();
      sessionStorageMock.restore();
    });

    it('should getAuthInfo', () => {
      const actual = authUtils.getAuthInfo('key');
      expect(actual).toEqual({test: 'test string 1'});
    });

    it('should setAuthInfo', () => {
      sinon.spy(localStorageFunctions, 'setItem');

      authUtils.setAuthInfo('key', 'value');
      expect(localStorageFunctions.setItem.callCount).toBe(1);

      localStorageFunctions.setItem.restore();
    });

    it('should getAuthRedirectPath', () => {
      const actual = authUtils.getAuthRedirectPath('key');
      expect(actual).toEqual('"test string 2"');
    });

    it('should setAuthRedirectPath', () => {
      sinon.spy(sessionStorageFunctions, 'setItem');

      authUtils.setAuthRedirectPath('key', 'value');
      expect(sessionStorageFunctions.setItem.callCount).toBe(1);

      sessionStorageFunctions.setItem.restore();
    });

    it('should handle null or empty auth redirect path', () => {
      sinon.spy(sessionStorageFunctions, 'setItem');

      authUtils.setAuthRedirectPath('key', '');
      authUtils.setAuthRedirectPath('key', null);
      expect(sessionStorageFunctions.setItem.callCount).toBe(0);

      sessionStorageFunctions.setItem.restore();
    });

    it('should removeAuthRedirectPath', () => {
      sinon.spy(sessionStorageFunctions, 'removeItem');

      authUtils.removeAuthRedirectPath('key');
      expect(sessionStorageFunctions.removeItem.callCount).toBe(1);

      sessionStorageFunctions.removeItem.restore();
    });
  });

  describe('tokenIsExpired', () => {
    it('should check if token is expired', () => {
      const actual = authUtils.tokenIsExpired({
        exp: new Date().toString()
      });

      expect(actual).toBe(true);
    });
  });

  describe('redirectToOriginalPath', () => {
    let savedWindow;

    beforeEach(() => {
      savedWindow = global.window;
      global.window = {
        location: {
          href: ''
        }
      };
    });

    afterEach(() => {
      global.window = savedWindow;
    });

    it('should redirect to original path', () => {
      authUtils.redirectToOriginalPath('/mypath', {
        baseUrl: 'localhost:3000'
      });

      expect(global.window.location.href).toEqual('localhost:3000/mypath');
    });

    it('should convert an undefined redirectPath to an empty string', () => {
      authUtils.redirectToOriginalPath(undefined, {
        baseUrl: 'localhost:3000'
      });

      expect(global.window.location.href).toEqual('localhost:3000');
    });
  });

  describe('getPathName', () => {
    it('should get router action pathname', () => {
      const actual = authUtils.getPathName(
        {
          type: '@@router',
          payload: {
            pathname: 'testroute'
          }
        },
        {}
      );
      expect(actual).toEqual('testroute');
    });

    it('should get non router action pathname', () => {
      const actual = authUtils.getPathName(
        {},
        {
          routing: {
            locationBeforeTransitions: {
              pathname: 'testroute'
            }
          }
        }
      );
      expect(actual).toEqual('testroute');
    });

    it('should return empty pathname', () => {
      const actual = authUtils.getPathName({}, {});
      expect(actual).toEqual('');
    });
  });

  describe('currentTokenIsOk', () => {
    describe('no hash', () => {
      const utils = require('../../src/auth/localUtilities');
      const localStorageFunctions = {
        getItem: () => {
          return JSON.stringify({});
        },
        setItem: () => {}
      };

      let localStorageMock;
      let hashMock;

      beforeEach(() => {
        localStorageMock = sinon
          .stub(utils, 'localStorageGetter')
          .callsFake(() => {
            return localStorageFunctions;
          });
        hashMock = sinon.stub(utils, 'getWindowHash').callsFake(() => {
          return 'test';
        });
      });

      afterEach(() => {
        localStorageMock.restore();
        hashMock.restore();
      });

      it('should return an okay token', () => {
        const actual = authUtils.currentTokenIsOk('', '', {
          parseHash: (hash, callback) => {
            console.log('got here');
          }
        }, {});
        actual.then(result => {
          expect(result).toEqual({
            isExpired: false,
            isOk: true
          });
        });
        return actual;
      });

      it('should set tokenIsOk to false if authInfo has error', () => {
        const oldFunc = localStorageFunctions.getItem;
        localStorageFunctions.getItem = () => {
          return JSON.stringify({
            error: 'error'
          });
        };

        const actual = authUtils.currentTokenIsOk('', '', {}, {});

        actual.then(result => {
          expect(result).toEqual({
            isExpired: false,
            isOk: false
          });
          localStorageFunctions.getItem = oldFunc;
        });

        return actual;
      });
    });

    describe('with hash', () => {
      const utils = require('../../src/auth/localUtilities');
      const sessionStorageFunctions = {
        getItem: () => {
          return '';
        },
        setItem: () => {},
        removeItem: () => {}
      };
      const localStorageFunctions = {
        getItem: () => {
          return JSON.stringify({
            exp: Date.parse('01/01/2000'),
            error: 'error'
          });
        },
        setItem: () => {}
      };

      let sessionStorageMock;
      let localStorageMock;
      let hashMock;

      beforeEach(() => {
        sessionStorageMock = sinon
          .stub(utils, 'sessionStorageGetter')
          .callsFake(() => {
            return sessionStorageFunctions;
          });
        localStorageMock = sinon
          .stub(utils, 'localStorageGetter')
          .callsFake(() => {
            return localStorageFunctions;
          });
        hashMock = sinon.stub(utils, 'getWindowHash').callsFake(() => {
          return 'access_token=';
        });
      });

      afterEach(() => {
        sessionStorageMock.restore();
        localStorageMock.restore();
        hashMock.restore();
      });

      it('should return an ok but expired token', () => {
        const actions = {
          parseHash: (hash, callback) => {
            callback(null, {
              expiresIn: 1000
            });
          }
        };
        sinon.spy(actions, 'parseHash');

        const actual = authUtils.currentTokenIsOk('', '', actions, {});
        actual.then(result => {
          expect(result).toEqual({
            isExpired: true,
            isOk: true
          });
          actions.parseHash.restore();
        });
        return actual;
      });

      it('should redirect if the token is not expired and is ok', () => {
        const oldWindow = global.window;
        global.window = {
          location: {
            href: ''
          }
        };

        const alteredFunctions = {
          getItem: () => {
            return JSON.stringify({
              exp: undefined,
              error: 'error'
            });
          },
          setItem: () => {}
        };

        localStorageMock.restore();
        localStorageMock = sinon
          .stub(utils, 'localStorageGetter')
          .callsFake(() => {
            return alteredFunctions;
          });

        const actions = {
          parseHash: (hash, callback) => {
            callback(null, {
              expiresIn: 10000
            });
          }
        };
        sinon.spy(actions, 'parseHash');
        sinon.spy(sessionStorageFunctions, 'removeItem');

        const actual = authUtils.currentTokenIsOk('', '', actions, {
          baseUrl: 'localhost:3000'
        });
        actual.then(result => {
          expect(sessionStorageFunctions.removeItem.callCount).toBe(1);
          expect(result).toEqual({
            isExpired: false,
            isOk: true
          });
          expect(global.window.location.href).toEqual('localhost:3000');

          sessionStorageFunctions.removeItem.restore();
          global.window = oldWindow;
        });
        return actual;
      });
    });
  });
});
