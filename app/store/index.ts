import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice'; // ✅ import this
import rootReducer from './configureStore';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer, // ✅ add this line
    reducer: rootReducer,
    // other reducers...
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
