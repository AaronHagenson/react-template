import {TOKEN_IS_EXPIRED, AUTHENTICATION_FAILED} from '../constants/actionTypes';

const initialState = {
  token: {
    isExpired: false,
    reAuthHandler: () => {
      // Do nothing for the initial state
    }
  }
};

export default function update(state = initialState.token, action) {
  if (action.type === TOKEN_IS_EXPIRED) {
    return Object.assign({}, state, {
      isExpired: true,
      reAuthHandler: action.payload.reAuthHandler
    });
  } else if (action.type === AUTHENTICATION_FAILED) {
    return { ...state, error: action.error };
  } else {
    return state;
  }
}
