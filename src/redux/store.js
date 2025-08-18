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


export const store = configureStore({
  reducer: {
    deal: dealReducer,
    auth:authReducer,
    store: storeReducer,
    category: categoryReducer,
    newsletter: newsletterReducer,
    reviews: reviewReducer,
    blogs: blogReducer,
    contact: contactReducer,
    homeAdmin: adminReducer,

  },
});
