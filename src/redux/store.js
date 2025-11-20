import { configureStore } from '@reduxjs/toolkit';
import dealReducer from './deal/dealSlice';
import authReducer from './auth/authSlice.js'
import storeReducer from './store/storeSlice';
import categoryReducer from './category/categorySlice';
import newsletterReducer from './newletter/newsletterSlice';
import reviewReducer from './review/reviewSlice.js';
import blogReducer from './blog/blogSlice';
import contactReducer from './contact/contactSlice.js'
import adminReducer from './admin/homeAdminSlice.js'
import { paymentApi } from './razorpay/paymentApi';
import paymeReducer from './razorpay/paymeslice';
import countryReducer from "./country/countrySlice";
import referralReducer from "./referral/referralSlice";


export const store = configureStore({
  reducer: {
    deal: dealReducer,
    auth:authReducer,
    store: storeReducer,
    category: categoryReducer,
    newsletter: newsletterReducer,
    country: countryReducer,
    reviews: reviewReducer,
    referral: referralReducer,

    blogs: blogReducer,
    contact: contactReducer,
    homeAdmin: adminReducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    payme: paymeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(paymentApi.middleware),

});
