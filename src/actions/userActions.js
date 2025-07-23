// src/actions/userActions.js
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return rejectWithValue('No token found');
    }

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const API_URL = process.env.REACT_APP_API_URL;
        const { data } = await axios.get(`${API_URL}/api/users/me`, config);
        return data.user;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});