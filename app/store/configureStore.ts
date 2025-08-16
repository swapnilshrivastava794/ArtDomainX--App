import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@store/slices/authSlice';
import postsReducer from '@store/slices/postsSlice';
import profileReducer from '@store/slices/profileSlice';
import userReducer from '@store/slices/userSlice';

const appReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  profile: profileReducer,
  user: userReducer,
  // baaki reducers agar hain to yahan add karo
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_ALL') {
    state = undefined; // poora state reset karne ke liye
  }
  return appReducer(state, action);
};

export default rootReducer;
