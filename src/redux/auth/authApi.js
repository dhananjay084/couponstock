"use client"; // Required because we use cookies & window

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Configure axios to send credentials (HTTP-only cookies)
axios.defaults.withCredentials = true;

// Next.js uses process.env.NEXT_PUBLIC_* for client-safe env variables
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Helper to store basic user info in client-side cookies
export const setUserDataInCookies = (user) => {
  if (user && typeof user === "object") {
    const expires = 15 / (24 * 60); // 15 minutes in days
    if (user.name) Cookies.set("userName", user.name, { expires });
    if (user.role) Cookies.set("userRole", user.role, { expires });
    if (user._id) Cookies.set("userId", user._id, { expires });
    if (user.email) Cookies.set("userEmail", user.email, { expires });
  } else {
    Cookies.remove("userName");
    Cookies.remove("userRole");
    Cookies.remove("userId");
    Cookies.remove("userEmail");
  }
};

// ===================== Async Thunks =====================

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/register`, userData);
      setUserDataInCookies(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed.");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/login`, credentials);
      setUserDataInCookies(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed.");
    }
  }
);

// Google OAuth login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      window.location.href = `${SERVER_URL}/api/auth/google`;
      return { message: "Redirecting to Google login..." };
    } catch (error) {
      return rejectWithValue(error.message || "Google login failed.");
    }
  }
);

// Refresh Access Token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/refresh-token`);
      return response.data;
    } catch (error) {
      setUserDataInCookies(null);
      return rejectWithValue(error.response?.data?.message || "Session expired. Please log in again.");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/logout`);
      setUserDataInCookies(null);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Logout failed.");
    }
  }
);

// Check Current User
export const checkCurrentUser = createAsyncThunk(
  "auth/checkCurrentUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/auth/current_user`);
      if (response.data.user && response.data.user._id) {
        const storedName = Cookies.get("userName");
        const storedEmail = Cookies.get("userEmail");
        const user = { ...response.data.user, name: storedName || "User", email: storedEmail };
        setUserDataInCookies(user);
        return user;
      } else {
        setUserDataInCookies(null);
        return rejectWithValue("Not authenticated.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await dispatch(refreshAccessToken()).unwrap();
          const refreshed = await axios.get(`${SERVER_URL}/api/auth/current_user`);
          if (refreshed.data.user && refreshed.data.user._id) {
            const storedName = Cookies.get("userName");
            const storedEmail = Cookies.get("userEmail");
            const user = { ...refreshed.data.user, name: storedName || "User", email: storedEmail };
            setUserDataInCookies(user);
            return user;
          } else {
            setUserDataInCookies(null);
            return rejectWithValue("Authentication failed after token refresh.");
          }
        } catch (refreshError) {
          setUserDataInCookies(null);
          return rejectWithValue(refreshError.response?.data?.message || "Session expired.");
        }
      }
      setUserDataInCookies(null);
      return rejectWithValue(error.response?.data?.message || "Failed to check authentication status.");
    }
  }
);

// Admin login (specific)
export const adminSpecificLogin = createAsyncThunk(
  "auth/adminSpecificLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/admin/login-specific`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Admin login failed.");
    }
  }
);
