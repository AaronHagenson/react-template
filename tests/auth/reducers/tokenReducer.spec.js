import tokenReducer from '../../../src/auth/reducers/tokenReducer';
import * as types from '../../../src/auth/constants/actionTypes';
import sinon from 'sinon';

describe('tokenReducer', () => {
  it('should return initial state', () => {
    const actualState = tokenReducer(undefined, {});

    expect(actualState.isExpired).toBe(false);
    expect(actualState.reAuthHandler).toBeDefined();
  });

  it('should return isExpired and reAuthHandler for TOKEN_IS_EXPIRED action', () => {
    const reAuthHandler = 'Test ReAuthHandler';
    const action = {
      type: types.TOKEN_IS_EXPIRED,
      payload: {
        reAuthHandler: reAuthHandler
      }
    };
    const expectedState = {
      isExpired: true,
      reAuthHandler: reAuthHandler
    };

    expect(tokenReducer([], action)).toEqual(expectedState);
  });

  it('should call reAuthHandler', () => {
    const state = tokenReducer(undefined, {});
    const spy = sinon.spy(state, 'reAuthHandler');
    state.reAuthHandler();

    expect(state.reAuthHandler.calledOnce).toBe(true);
    spy.restore();
  });
});
