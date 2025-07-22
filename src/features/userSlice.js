import { createSlice } from '@reduxjs/toolkit';
import { loadUser } from '../actions/userActions'; // Aapki existing userActions file se

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true,
        error: null,
    },
    reducers: {
        // Yeh function login page se call hoga
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        // Yeh function logout ke waqt call hoga
        logoutSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token'); // Token bhi remove kardein
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
export default userSlice.reducer;