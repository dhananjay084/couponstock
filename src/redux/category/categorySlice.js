import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCategoriesAPI,
  addCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
  searchCategoriesAPI // Import the new searchCategoriesAPI function
} from './categoryApi';

// Thunks
export const getCategories = createAsyncThunk('category/getCategories', async (_, thunkAPI) => {
  try {
    return await getCategoriesAPI();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addCategory = createAsyncThunk('category/addCategory', async (data, thunkAPI) => {
  try {
    return await addCategoryAPI(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateCategory = createAsyncThunk('category/updateCategory', async ({ id, data }, thunkAPI) => {
  try {
    return await updateCategoryAPI({ id, data });
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteCategory = createAsyncThunk('category/deleteCategory', async (id, thunkAPI) => {
  try {
    await deleteCategoryAPI(id);
    return id; // Return the ID to filter it out from the state
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// New Async Thunk for searching categories
export const searchCategories = createAsyncThunk('category/searchCategories', async (searchTerm, thunkAPI) => {
  try {
    return await searchCategoriesAPI(searchTerm); // Call the API function
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [], // This will hold all categories (e.g., from getCategories)
    searchResults: [], // NEW: This will hold only the search results
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
      // Handle getCategories (all categories)
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; // Update categories array
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Access payload for error message
      })

      // Handle addCategory
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload); // Add new category to the array
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle updateCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload; // Update the specific category
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle deleteCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        // Corrected payload access for filter
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // New: Handle searchCategories
      .addCase(searchCategories.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors
        state.searchResults = []; // Clear previous search results when a new search starts
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload; // Update the searchResults array
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.searchResults = []; // Clear results on error
      });
  },
});

export const { clearSearchResults } = categorySlice.actions; // Export the new action
export default categorySlice.reducer;
