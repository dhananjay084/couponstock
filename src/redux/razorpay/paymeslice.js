import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paymentStatus: null,
  payoutStatus: null,
  error: null,
};

const paymeSlice = createSlice({
  name: 'payme',
  initialState,
  reducers: {
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setPayoutStatus: (state, action) => {
      state.payoutStatus = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearStatus: (state) => {
      state.paymentStatus = null;
      state.payoutStatus = null;
      state.error = null;
    },
  },
});

export const { setPaymentStatus, setPayoutStatus, setError, clearStatus } = paymeSlice.actions;

export default paymeSlice.reducer;
