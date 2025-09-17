import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/payment' }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/create-order',
        method: 'POST',
        body,
      }),
    }),
    addBeneficiary: builder.mutation({
      query: (body) => ({
        url: '/add-beneficiary',
        method: 'POST',
        body,
      }),
    }),
    createPayout: builder.mutation({
      query: (body) => ({
        url: '/create-payout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useAddBeneficiaryMutation, useCreatePayoutMutation } = paymentApi;
