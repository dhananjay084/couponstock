// src/api/homeAdminAPI.js
import { getHomeAdminData, createHomeAdmin, updateHomeAdmin } from './homeAdminSlice';
import { toast } from "react-toastify";

// ✅ Get HomeAdmin Data
export const fetchHomeAdmin = () => async (dispatch) => {
  try {
    await dispatch(getHomeAdminData());
  } catch (err) {
    console.error('Fetch error:', err);
    toast.error("Failed to fetch data ");
  }
};

// ✅ Create HomeAdmin Entry
export const submitHomeAdmin = (formData) => async (dispatch) => {
  try {
    await dispatch(createHomeAdmin(formData));
  } catch (err) {
    console.error('Create error:', err);
     toast.error("Failed to create entry ");
    throw err;
  }
};

// ✅ Update HomeAdmin Entry
export const modifyHomeAdmin = (id, formData) => async (dispatch) => {
  try {
    await dispatch(updateHomeAdmin({ id, data: formData }));
  } catch (err) {
    console.error('Update error:', err);
     toast.error("Failed to update entry ");
    throw err;
  }
};
