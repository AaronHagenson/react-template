import Config, {trimTrailingSlash} from '../../src/config/config';
import * as source from '../../src/config/configSource';
import $ from 'jquery';
import sinon from 'sinon';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('config', () => {
  it('should trim trailing slash', () => {
    const url1 = trimTrailingSlash('www.google.com/');
    const url2 = trimTrailingSlash('www.google.com');

    expect(url1).toBe('www.google.com');
    expect(url2).toBe('www.google.com');
  });

  describe('IIS', () => {
    let sourceMock;
    let jqueryMock;
    let windowMock;

    beforeEach(() => {
      sourceMock = sinon.stub(source, 'isIis').returns(true);
      windowMock = global.window.location;
      global.window.location = {
        origin: '',
        pathname: '/'
      };
    });

    afterEach(() => {
      sourceMock.restore();
      jqueryMock.restore();
      global.window.location = windowMock;
    });

    it('should load configuration', () => {
      jqueryMock = sinon.stub($, 'getJSON').callsFake((path, callback) => {
        callback({
          testParam: 'test param'
        });
      });

      return Config.loadConfiguration().then(() => {
        expect(Config.getConfig()).toEqual({
          testParam: 'test param'
        });
      });
    });

    it('should handle error', () => {
      jqueryMock = sinon
        .stub($, 'getJSON')
        .callsFake((data, callback, errorCallback) => {
          errorCallback('error getting json');
        });

      return Config.loadConfiguration().catch(err => {
        expect(err).toEqual('Unable to get configuration: error getting json');

        let error = false;
        try {
          Config.getConfig();
        } catch (e) {
          expect(e).toEqual('Config not loaded');
          error = true;
        }

        expect(error).toBe(true);
      });
    });
  });

  describe('Node.js', () => {
    let sourceMock;
    let mockAdapter;

    beforeEach(() => {
      sourceMock = sinon.stub(source, 'isIis').returns(false);
      mockAdapter = new MockAdapter(axios);
    });

    afterEach(() => {
      sourceMock.restore();
      mockAdapter.restore();
    });

    it('should load configuration', () => {
      mockAdapter
        .onGet('null/configuration')
        .reply(200, '{"testParam":"test param"}');

      return Config.loadConfiguration().then(() => {
        expect(Config.getConfig()).toEqual({
          testParam: 'test param'
        });
      });
    });

    it('should handle error', () => {
      mockAdapter
        .onGet('null/configuration')
        .reply(404, 'Configuration not found');

      return Config.loadConfiguration().catch(err => {
        expect(err).toEqual(
          'Unable to get configuration: Error: Request failed with status code 404'
        );

        let error = false;
        try {
          Config.getConfig();
        } catch (e) {
          expect(e).toEqual('Config not loaded');
          error = true;
        }

        expect(error).toBe(true);
      });
    });
  });
});
