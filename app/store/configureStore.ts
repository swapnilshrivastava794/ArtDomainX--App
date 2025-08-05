// store/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import postsReducer from '../store/slices/postsSlice';
// add all other reducers

const appReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  // other reducers
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_ALL') {
    state = undefined; // 🔥 This resets everything
  }
  return appReducer(state, action);
};

export default rootReducer;
