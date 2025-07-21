import { configureStore, createSlice } from '@reduxjs/toolkit';

// This is a temporary placeholder for your user data.
// Your Payment.jsx component needs this to work.
const userSlice = createSlice({
  name: 'user',
  initialState: {
    // You can set initial user state here if needed
    user: null, 
    isAuthenticated: false,
  },
  reducers: {
    // You will add functions here later to log in/log out the user
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Create the Redux store
const store = configureStore({
  reducer: {
    // This tells the store how to handle the 'user' part of the state
    user: userSlice.reducer,
  },
});

export default store;