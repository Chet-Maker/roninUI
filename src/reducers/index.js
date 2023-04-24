import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import gyms from './getGymsReducer';

export default combineReducers({
    form: formReducer,
    gyms
});