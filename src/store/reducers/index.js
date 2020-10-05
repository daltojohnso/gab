import { combineReducers } from 'redux';
import auth from './auth';
import maps from './maps';
import notes from './notes';
import users from './users';

export default combineReducers({
    auth,
    maps,
    notes,
    users
});
