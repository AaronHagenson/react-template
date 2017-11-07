import * as actions from '../../../src/auth/actions/tokenActions';
import * as types from '../../../src/auth/constants/actionTypes';

describe('tokenActions', () => {
  it('should have correct action', () => {
    let called = false;
    const myFunc = () => {
      called = true;
    };
    const action = actions.tokenExpired(myFunc);

    expect(action.type).toBe(types.TOKEN_IS_EXPIRED);
    expect(action.payload.reAuthHandler).toBe(myFunc);

    action.payload.reAuthHandler();
    expect(called).toBe(true);
  });
});
