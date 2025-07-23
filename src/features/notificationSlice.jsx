import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Action to fetch notifications from the backend
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue('No token found');
        }
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const API_URL = process.env.REACT_APP_API_URL;
            const { data } = await axios.get(`${API_URL}/api/notifications`, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearNotifications: (state) => {
            state.items = [];
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.notifications;
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;