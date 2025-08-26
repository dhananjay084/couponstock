import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

<<<<<<< HEAD
const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews`;
=======
const API_URL = 'https://mycouponstock-production.up.railway.app/api/reviews';
>>>>>>> 84c32e74379f521a1aff947b8c40defcab5c7886

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const addReview = createAsyncThunk('reviews/addReview', async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
});

export const updateReview = createAsyncThunk('reviews/updateReview', async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
});

export const deleteReview = createAsyncThunk('reviews/deleteReview', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state) => { state.loading = false; })

      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })

      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.reviews[index] = action.payload;
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload);
      });
  }
});

export default reviewSlice.reducer;
