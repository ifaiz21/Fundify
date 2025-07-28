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
  reducers: {
    updateCampaignOnDonation: (state, action) => {
      const { campaignId, donationAmount } = action.payload;
      const campaignToUpdate = state.allCampaigns.find(c => c._id === campaignId);
      
      if (campaignToUpdate) {
        campaignToUpdate.raisedAmount += donationAmount;
        // Agar backers count bhi update karna hai
        if (campaignToUpdate.totalBackers !== undefined) {
          campaignToUpdate.totalBackers += 1;
        }
      }
    }
  },
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

export const { updateCampaignOnDonation } = campaignsSlice.actions;

export default campaignsSlice.reducer;