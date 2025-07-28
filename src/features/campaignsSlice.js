import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk (API call ke liye)
export const fetchCampaigns = createAsyncThunk('campaigns/fetchCampaigns', async () => {
  const response = await axios.get("https://server-fundify.up.railway.app/api/campaigns");
  return response.data.campaigns || []; // Backend se poora array bhejein
});

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: {
    allCampaigns: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allCampaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default campaignsSlice.reducer;