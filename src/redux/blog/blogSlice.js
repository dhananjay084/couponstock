import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './blogApi';
import { toast } from 'react-toastify'; // Ensure toast is imported

// Fetch all blogs
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (_, thunkAPI) => {
  try {
    const response = await api.getAllBlogs();
    return response.data;
  } catch (err) {
    // Ensure you're extracting the error message correctly from the backend response
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

// Create new blog
export const createBlog = createAsyncThunk('blogs/createBlog', async (blogData, thunkAPI) => {
  try {
    const response = await api.addBlog(blogData);
    return response.data;
  } catch (err) {
    // Ensure you're extracting the error message correctly from the backend response
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

// Update blog
export const updateBlog = createAsyncThunk('blogs/updateBlog', async ({ id, data }, thunkAPI) => {
  try {
    const response = await api.editBlog(id, data);
    return response.data;
  } catch (err) {
    // Ensure you're extracting the error message correctly from the backend response
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});

// Delete blog
export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id, thunkAPI) => {
  try {
    await api.removeBlog(id);
    return id;
  } catch (err) {
    // Ensure you're extracting the error message correctly from the backend response
    return thunkAPI.rejectWithValue(err.response?.data?.error || err.message);
  }
});
export const fetchBlogById = createAsyncThunk(
    'blogs/fetchBlogById',
    async (id, thunkAPI) => {
      try {
        const response = await api.getBlogById(id);
        return response.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.error || err.message
        );
      }
    }
  );
  
const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    loading: false,
    error: null,
    currentBlog: null, 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(`Failed to fetch blogs: ${action.payload}`); // Added toast for error
      })

      // Create Blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
        toast.success('Blog created successfully!'); // Added toast for success
      })
      .addCase(createBlog.rejected, (state, action) => { // Added rejected case
        state.loading = false;
        state.error = action.payload;
        toast.error(`Failed to create blog: ${action.payload}`); // Added toast for error
      })

      // Update Blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        toast.success('Blog updated successfully!'); // Added toast for success
      })
      .addCase(updateBlog.rejected, (state, action) => { // Added rejected case
        state.loading = false;
        state.error = action.payload;
        toast.error(`Failed to update blog: ${action.payload}`); // Added toast for error
      })

      // Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        toast.success('Blog deleted successfully!'); // Added toast for success
      })
      .addCase(deleteBlog.rejected, (state, action) => { // Added rejected case
        state.loading = false;
        state.error = action.payload;
        toast.error(`Failed to delete blog: ${action.payload}`); // Added toast for error
      })
      // Fetch single blog by ID
.addCase(fetchBlogById.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchBlogById.fulfilled, (state, action) => {
    state.currentBlog = action.payload;
    state.loading = false;
  })
  .addCase(fetchBlogById.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    toast.error(`Failed to fetch blog: ${action.payload}`);
  })
  
  },
});

export default blogSlice.reducer;
