import {combineReducers} from 'redux';
import auth from './auth';
import maps from './maps';
import notes from './notes';

export default combineReducers({
    auth,
    maps,
    notes
});
