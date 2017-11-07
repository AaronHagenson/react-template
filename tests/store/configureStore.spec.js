import * as store from '../../src/store/configureStore';
import sinon from 'sinon';
import config from '../../src/config/config';

describe('configureStore', () => {
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

  describe('getAuthMiddlewareConfig', () => {
    it('should load config', () => {
      const actual = store.getAuthMiddlewareConfig();

      expect(actual).toEqual({
        domain: 'test domain',
        clientID: 'test id',
        authConnection: 'chr test',
        audience: 'test audience',
        actionsWhitelist: [
          'TOKEN_IS_EXPIRED'
        ],
        storagePrefix: 'react-slingshot',
        baseUrl: 'nullblank'
      });
    });
  });

  describe('configureStoreProd', () => {
    it('should return prod store', () => {
      const actual = store.configureStoreProd({});

      expect(actual).toBeDefined();
    });
  });

  describe('configureStoreDev', () => {
    it('should return dev store', () => {
      const actual = store.configureStoreDev({});

      expect(actual).toBeDefined();
    });
  });

  describe('configureStore', () => {
    let loadConfigMock;

    beforeEach(() => {
      loadConfigMock = sinon.stub(config, 'loadConfiguration').callsFake(() => {
        return new Promise(resolve => {
          resolve();
        });
      });
    });

    afterEach(() => {
      loadConfigMock.restore();
    });

    it('should should choose the dev store', () => {
      process.env.NODE_ENV = 'development';

      return store.configureStore()
        .then(store => {
          expect(store).toBeDefined();
        });
    });

    it('should should choose the prod store', () => {
      process.env.NODE_ENV = 'production';

      return store.configureStore()
        .then(store => {
          expect(store).toBeDefined();
        });
    });

    it('should handle exception', () => {
      loadConfigMock.restore();
      loadConfigMock = sinon.stub(config, 'loadConfiguration').callsFake(() => {
        return new Promise((res, rej) => {
          rej('err');
        });
      });

      return store.configureStore()
        .catch(err => {
          expect(err).toEqual('err');
        });
    });
  });
});
