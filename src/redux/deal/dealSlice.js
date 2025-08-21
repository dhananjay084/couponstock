import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify'; // Ensure toast is imported if you use it
import {
  getAllDeals,
  createDeal,
  deleteDealById,
  updateDealById,
  getDealById,
  searchDeals as searchDealsApi // Renamed to avoid conflict with thunk name
} from './dealAPI'; // Import the new searchDeals API function

// Async Thunk for getting all deals
export const getDeals = createAsyncThunk('deal/getDeals', async (_, thunkAPI) => {
  try {
    return await getAllDeals();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Async Thunk for adding a new deal
export const addDeal = createAsyncThunk('deal/addDeal', async (deal, thunkAPI) => {
  try {
    return await createDeal(deal);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Async Thunk for deleting a deal
export const deleteDeal = createAsyncThunk('deal/deleteDeal', async (id, thunkAPI) => {
  try {
    await deleteDealById(id);
    return id; // Return the ID to filter it out from the state
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Async Thunk for updating a deal
export const updateDeal = createAsyncThunk('deal/updateDeal', async ({ id, data }, thunkAPI) => {
  try {
    return await updateDealById(id, data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Async Thunk for getting a single deal by ID
export const getSingleDeal = createAsyncThunk('deal/getSingleDeal', async (id, thunkAPI) => {
    try {
      return await getDealById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  });

// New Async Thunk for searching deals
export const searchDeals = createAsyncThunk('deal/searchDeals', async (searchTerm, thunkAPI) => {
  try {
    return await searchDealsApi(searchTerm); // Call the API function
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
  
const dealSlice = createSlice({
  name: 'deal',
  initialState: {
    deals: [], // This will hold all deals (e.g., from getDeals)
    searchResults: [], // NEW: This will hold only the search results
    singleDeal: null,
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
      // Handle getDeals (all deals)
      .addCase(getDeals.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(getDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload; // Update deals array
      })
      .addCase(getDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(`Fetch deals failed: ${action.payload}`);
      })

      // Handle addDeal
      .addCase(addDeal.fulfilled, (state, action) => {
        state.deals.push(action.payload); // Add new deal to the array
        // toast.success('Deal added!');
      })
      .addCase(addDeal.rejected, (state, action) => {
        toast.error(`Add deal failed: ${action.payload}`);
      })

      // Handle deleteDeal
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.deals = state.deals.filter((d) => d._id !== action.payload); // Filter out deleted deal
        // toast.success('Deal deleted');
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        toast.error(`Delete deal failed: ${action.payload}`);
      })

      // Handle updateDeal
      .addCase(updateDeal.fulfilled, (state, action) => {
        const index = state.deals.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) state.deals[index] = action.payload; // Update the specific deal
        // toast.success('Deal updated');
      })
      .addCase(updateDeal.rejected, (state, action) => {
        toast.error(`Update deal failed: ${action.payload}`);
      })

      // Handle getSingleDeal
      .addCase(getSingleDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.singleDeal = action.payload; // Set the single deal object
      })
      .addCase(getSingleDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(`Get single deal failed: ${action.payload}`);
      })

      // New: Handle searchDeals
      .addCase(searchDeals.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
        state.searchResults = []; // Clear previous search results when a new search starts
      })
      .addCase(searchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload; // Update the searchResults array
      })
      .addCase(searchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.searchResults = []; // Clear results on error
        toast.error(`Search deals failed: ${action.payload}`);
      });
  },
});

export const { clearSearchResults } = dealSlice.actions; // Export the new action
export default dealSlice.reducer;
