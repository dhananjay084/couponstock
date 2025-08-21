// src/redux/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  googleLogin,
  refreshAccessToken,
  logoutUser,
  checkCurrentUser,
  adminSpecificLogin
} from './authApi'; // Import all your async thunks
// import { toast } from "react-toastify";

// Initial state for authentication
const initialState = {
  user: null, // Stores user data (_id, name, email, role etc.)
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer to clear authentication state (e.g., on manual logout or session expiry)
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    // Reducer to set a message (e.g., from Google OAuth redirect or custom messages)
    setAuthMessage: (state, action) => {
      state.message = action.payload.message;
      state.error = action.payload.type === 'error' ? action.payload.message : null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Payload contains user data from backend
        state.isAuthenticated = true;
        state.message = action.payload.message || 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Payload is the error message from rejectWithValue
        state.message = null;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.message = action.payload.message || 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Google Login (initiation - actual login/cookie setting handled by backend redirect)
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message; // "Redirecting to Google..."
        // isAuthenticated and user will be set by checkCurrentUser after redirect
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // Refresh Access Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true; // If refresh succeeds, user is authenticated
        state.message = 'Access token refreshed.';
        // User data is not returned by refresh, relies on checkCurrentUser for full user object
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
        state.user = null; // Clear user on refresh failure
        state.isAuthenticated = false;
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // Check Current User
      .addCase(checkCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Payload is the user object from backend
        state.isAuthenticated = true;
        state.message = 'Session active.';
      })
      .addCase(checkCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Admin Specific Login (if used)
      .addCase(adminSpecificLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(adminSpecificLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // This specific admin login might not set full user state or isAuthenticated,
        // as it's designed for a specific route check, not general session.
        // If you want it to fully log in an admin, you'd need the backend to set cookies.
      })
      .addCase(adminSpecificLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      });
  },
});

export const { clearAuth, setAuthMessage, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
