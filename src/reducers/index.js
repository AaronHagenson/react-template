import {combineReducers} from 'redux';
import auth from '../auth/reducers/authProfileReducer';
import token from '../auth/reducers/tokenReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  routing: routerReducer,
  auth,
  token
});

export default rootReducer;
