import { configureStore, createSlice } from '@reduxjs/toolkit';
import { loadUser } from './actions/userActions';

// This is a temporary placeholder for your user data.
// Your Payment.jsx component needs this to work.
const userSlice = createSlice({
  name: 'user',
  initialState: {
    // You can set initial user state here if needed
    user: null, 
    isAuthenticated: false,
    loading: true,
    error: null,
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
   extraReducers: (builder) => {
        builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            });
    },
});
export const { loginSuccess, logoutSuccess } = userSlice.actions;

// Create the Redux store
const store = configureStore({
  reducer: {
    // This tells the store how to handle the 'user' part of the state
    user: userSlice.reducer,
  },
});

export default store;