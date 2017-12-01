import * as store from '../../src/store/configureStore';
import sinon from 'sinon';
import config from '../../src/config/config';
import * as authConfig from '../../src/store/authMiddlewareConfig';

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

  describe('configureStoreProd', () => {
    let storeAuthMock;
    let tempAuthConfig = {
      domain: '',
      clientID: '',
      authConnection: '',
      audience: '',
      actionsWhitelist: [],
      storagePrefix: '',
      baseUrl: ''
    };

    beforeEach(() => {
      storeAuthMock = sinon
        .stub(authConfig, 'getAuthMiddlewareConfig')
        .returns(tempAuthConfig);
    });

    afterEach(() => {
      storeAuthMock.restore();
    });

    it('should return prod store', () => {
      const actual = store.configureStoreProd({});
      sinon.stub(actual, 'dispatch').callsFake(() => {});
      tempAuthConfig.tokenExpiredHandler();

      expect(actual.dispatch.callCount).toBe(1);
      expect(storeAuthMock.callCount).toBe(1);
      expect(tempAuthConfig.tokenExpiredHandler).toBeDefined();
      expect(actual).toBeDefined();
      actual.dispatch.restore();
    });
  });

  describe('configureStoreDev', () => {
    let storeAuthMock;
    let tempAuthConfig = {
      domain: '',
      clientID: '',
      authConnection: '',
      audience: '',
      actionsWhitelist: [],
      storagePrefix: '',
      baseUrl: ''
    };

    beforeEach(() => {
      storeAuthMock = sinon
        .stub(authConfig, 'getAuthMiddlewareConfig')
        .returns(tempAuthConfig);
    });

    afterEach(() => {
      storeAuthMock.restore();
    });

    it('should return dev store', () => {
      const actual = store.configureStoreDev({});
      sinon.stub(actual, 'dispatch').callsFake(() => {});
      tempAuthConfig.tokenExpiredHandler();

      expect(actual.dispatch.callCount).toBe(1);
      expect(storeAuthMock.callCount).toBe(1);
      expect(tempAuthConfig.tokenExpiredHandler).toBeDefined();
      expect(actual).toBeDefined();
      actual.dispatch.restore();
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

      return store.configureStore().then(store => {
        expect(store).toBeDefined();
      });
    });

    it('should should choose the prod store', () => {
      process.env.NODE_ENV = 'production';

      return store.configureStore().then(store => {
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

      return store.configureStore().catch(err => {
        expect(err).toEqual('err');
      });
    });
  });
});
