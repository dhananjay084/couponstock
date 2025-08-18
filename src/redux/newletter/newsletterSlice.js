// src/redux/newsletter/newsletterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscribeUserAPI } from './newsletterApi';

export const subscribeUser = createAsyncThunk(
  'newsletter/subscribeUser',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await subscribeUserAPI(emailData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetSubscriberState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(subscribeUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(subscribeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSubscriberState } = newsletterSlice.actions;
export default newsletterSlice.reducer;
