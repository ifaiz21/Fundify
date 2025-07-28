import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// NOTE: Aap login/profile fetch karne ke liye bhi yahan Thunk bana sakte hain.
// Abhi ke liye hum simple reducers se kaam chalayenge jo UserContext jesa kaam karein.

export const toggleSaveCampaign = createAsyncThunk(
  'auth/toggleSaveCampaign',
  async (campaignId, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token');

    try {
      const response = await fetch('https://server-fundify.up.railway.app/api/users/saved-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ campaignId }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return { campaignId, saved: data.saved };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);


const initialState = {
  userProfile: null,
  isAuthenticated: false,
  // savedCampaigns alag se manage nahi karenge, yeh userProfile ke andar hi hoga
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Jab user login kare ya app load ho to isko call karein
    setAuthUser: (state, action) => {
      state.userProfile = action.payload;
      state.isAuthenticated = !!action.payload; // Agar payload hai to true, warna false
    },
    logoutAuthUser: (state) => {
      state.userProfile = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleSaveCampaign.fulfilled, (state, action) => {
      if (state.userProfile) {
        const { campaignId, saved } = action.payload;
        const currentSaved = state.userProfile.savedCampaigns || [];
        if (saved) {
          // Add if not already present
          if (!currentSaved.includes(campaignId)) {
            state.userProfile.savedCampaigns.push(campaignId);
          }
        } else {
          // Remove the id
          state.userProfile.savedCampaigns = currentSaved.filter(id => id !== campaignId);
        }
      }
    });
  },
});

export const { setAuthUser, logoutAuthUser } = authSlice.actions;
export default authSlice.reducer;