import { combineReducers } from 'redux';
import counterReducer from './Reducers/counter';
import userDetailsReducer from './Reducers/userDetails';
import redirectReducer from './Reducers/redirect';

export default combineReducers({counterReducer, userDetailsReducer, redirectReducer})