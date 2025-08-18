import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    addStoreAPI,
  getStoresAPI,
  deleteStoreAPI,
  updateStoreAPI,
  getStoreByIdAPI,
  searchStoresAPI // Import the new searchStoresAPI function
} from './storeAPI.js';
// No direct axios import needed here as it's handled in storeAPI.js
// import axios from 'axios'; // This line can be removed if not used elsewhere

export const getStores = createAsyncThunk('store/getStores', async (_, thunkAPI) => {
  try {
    return await getStoresAPI();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addStore = createAsyncThunk('store/addStore', async (storeData, thunkAPI) => {
  try {
    return await addStoreAPI(storeData);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteStore = createAsyncThunk('store/deleteStore', async (id, thunkAPI) => {
  try {
    await deleteStoreAPI(id);
    return id; // Return the ID to filter it out from the state
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateStore = createAsyncThunk(
    'store/updateStore',
    async ({ id, data }, thunkAPI) => {
      try {
        return await updateStoreAPI({ id, data }); 
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

export const getStoreById = createAsyncThunk('store/getStoreById', async (id, thunkAPI) => {
    try {
      return await getStoreByIdAPI(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  });

// New Async Thunk for searching stores
export const searchStores = createAsyncThunk('store/searchStores', async (searchTerm, thunkAPI) => {
  try {
    return await searchStoresAPI(searchTerm); // Call the API function
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
  
const storeSlice = createSlice({
  name: 'store',
  initialState: {
    stores: [], // This will hold all stores (e.g., from getStores)
    searchResults: [], // NEW: This will hold only the search results
    singleStore: null, // Renamed from storeDetails for consistency
    loading: false,
    error: null,
  },
  reducers: {
    // New reducer to explicitly clear search results from the state
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle getStores (all stores)
      .addCase(getStores.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload; // Update stores array
      })
      .addCase(getStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Access payload for error message
      })

      // Handle addStore
      .addCase(addStore.fulfilled, (state, action) => {
        state.stores.push(action.payload); // Add new store to the array
      })
      .addCase(addStore.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle deleteStore
      .addCase(deleteStore.fulfilled, (state, action) => {
        // Corrected payload access for filter
        state.stores = state.stores.filter(store => store._id !== action.payload);
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle updateStore
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.stores.findIndex(store => store._id === action.payload._id);
        if (index !== -1) {
          state.stores[index] = action.payload; // Update the specific store
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle getStoreById
      .addCase(getStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleStore = action.payload; // Set the single store object
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.singleStore = null;
      })

      // New: Handle searchStores
      .addCase(searchStores.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
        state.searchResults = []; // Clear previous search results when a new search starts
      })
      .addCase(searchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload; // Update the searchResults array
      })
      .addCase(searchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.searchResults = []; // Clear results on error
      });
  },
});

export const { clearSearchResults } = storeSlice.actions; // Export the new action
export default storeSlice.reducer;
