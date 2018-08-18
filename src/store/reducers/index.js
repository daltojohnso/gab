import {combineReducers} from 'redux';
import auth from './auth';
import maps from './maps';
import notes from './notes';
import users from './users';
import nav from './nav';

export default combineReducers({
    auth,
    maps,
    notes,
    users,
    nav
});
