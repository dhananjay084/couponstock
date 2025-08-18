// src/redux/admin/homeAdminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = 'https://mycouponstock-production.up.railway.app
/api/admin';

// Fetch entries
export const getHomeAdminData = createAsyncThunk('homeAdmin/get', async () => {
  const res = await axios.get(BASE);
  
  return res.data.data;
});

// Create
export const createHomeAdmin = createAsyncThunk('homeAdmin/create', async (payload) => {
  const res = await axios.post(BASE, payload);
  return res.data.data;
});

// Update
export const updateHomeAdmin = createAsyncThunk('homeAdmin/update', async ({ id, data }) => {
  const res = await axios.patch(`${BASE}/${id}`, data);
  return res.data.data;
});

const homeAdminSlice = createSlice({
  name: 'homeAdmin',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get
      .addCase(getHomeAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeAdminData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getHomeAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createHomeAdmin.fulfilled, (state, { payload }) => {
        state.data.push(payload);
      })

      // Update
      .addCase(updateHomeAdmin.fulfilled, (state, { payload }) => {
        const index = state.data.findIndex((item) => item._id === payload._id);
        if (index !== -1) {
          state.data[index] = payload;
        }
      });
  },
});

export default homeAdminSlice.reducer;
