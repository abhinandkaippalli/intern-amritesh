import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
});

export default store;
