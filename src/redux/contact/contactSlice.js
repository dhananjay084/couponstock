// contactSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createContactAPI, fetchContactsAPI } from "./ContactApi.js";

// Thunk for submitting contact
export const submitContact = createAsyncThunk(
  "contact/submitContact",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await createContactAPI(formData);
      return result;
    } catch (err) {
      return rejectWithValue(err.message || "Submission failed");
    }
  }
);

// Thunk for fetching all contacts
export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await fetchContactsAPI();
      return result;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load contacts");
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    list: [],
    submission: null,
    submitStatus: "idle", // idle | loading | succeeded | failed
    fetchStatus: "idle", // idle | loading | succeeded | failed
    submitError: null,
    fetchError: null,
  },
  reducers: {
    resetContactState: (state) => {
      state.submission = null;
      state.submitStatus = "idle";
      state.submitError = null;
    },
    resetFetchedContacts: (state) => {
      state.list = [];
      state.fetchStatus = "idle";
      state.fetchError = null;
    },
  },
  extraReducers: (builder) => {
    // submitContact handlers
    builder
      .addCase(submitContact.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
        state.submission = null;
      })
      .addCase(submitContact.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.submission = action.payload;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.payload || "Failed to submit";
      });

    // fetchContacts handlers
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload || "Failed to fetch";
      });
  },
});

export const { resetContactState, resetFetchedContacts } = contactSlice.actions;
export default contactSlice.reducer;
