import { configureStore } from '@reduxjs/toolkit';

// Dono slices se unke reducers ko import karein
import userReducer from './features/userSlice';
import notificationReducer from './features/notificationSlice';

const store = configureStore({
  reducer: {
    // Redux store ko batayein ke kaun sa reducer state ke kis hisse ko manage karega
    user: userReducer,
    notifications: notificationReducer,
  },
});

export default store;

// Actions ko bhi store se export kar sakte hain taake import karna aasan ho
export * from './features/userSlice';
export * from './features/notificationSlice';