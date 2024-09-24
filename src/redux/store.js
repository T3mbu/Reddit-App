// src/redux/store.js

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';  // Import 'thunk' from 'redux-thunk'
import { redditReducer } from './reducers';

// Combine reducers (in case you have more in the future)
const rootReducer = combineReducers({
  reddit: redditReducer,  // This will handle the Reddit-related state
});

// Create the Redux store with thunk middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Add thunk middleware to handle async actions
);

export default store;
