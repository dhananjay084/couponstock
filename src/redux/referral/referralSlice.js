import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReferralLink, registerWithReferral, getMyReferrals } from "./referralApi";

// Async actions
export const fetchReferralLink = createAsyncThunk(
    "referral/fetchReferralLink",
    async (_, thunkAPI) => {
      try {
        return await getReferralLink(); // ✅ no token argument
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Error");
      }
    }
  );
  
  export const fetchMyReferrals = createAsyncThunk(
    "referral/fetchMyReferrals",
    async (_, thunkAPI) => {
      try {
        return await getMyReferrals(); // ✅ no token argument
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Error");
      }
    }
  );
  

export const signupWithReferral = createAsyncThunk(
  "referral/signupWithReferral",
  async (userData, thunkAPI) => {
    try {
      return await registerWithReferral(userData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);



// Slice
const referralSlice = createSlice({
  name: "referral",
  initialState: {
    referralLink: "",
    referrals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get referral link
      .addCase(fetchReferralLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReferralLink.fulfilled, (state, action) => {
        state.loading = false;
        state.referralLink = action.payload.referralLink;
      })
      .addCase(fetchReferralLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(signupWithReferral.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupWithReferral.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupWithReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // My Referrals
      .addCase(fetchMyReferrals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload.referrals;
      })
      .addCase(fetchMyReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default referralSlice.reducer;
