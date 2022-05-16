//imports for creating a store
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import user from './components/States/User-state';

const Reducers = combineReducers({user})

const store = createStore(Reducers, applyMiddleware(thunk));

export default store;

