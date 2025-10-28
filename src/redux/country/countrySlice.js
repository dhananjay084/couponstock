import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCountriesApi,
  addCountryApi,
  deleteCountryApi,
} from "./countryApi.js";

// Fetch all countries
export const fetchCountries = createAsyncThunk(
  "country/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllCountriesApi();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a country
export const addCountry = createAsyncThunk(
  "country/add",
  async (country_name, { rejectWithValue }) => {
    try {
      return await addCountryApi(country_name);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a country
export const deleteCountry = createAsyncThunk(
  "country/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCountryApi(id);
      return id; // return deleted id for state update
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const countrySlice = createSlice({
  name: "country",
  initialState: {
    countries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addCountry.fulfilled, (state, action) => {
        state.countries.push(action.payload.country);
      })

      // Delete
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.countries = state.countries.filter(
          (c) => c._id !== action.payload
        );
      });
  },
});

export default countrySlice.reducer;
