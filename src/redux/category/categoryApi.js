import axios from 'axios';

const BASE_URL = 'https://mycouponstock-production.up.railway.app/api/categories';

export const getCategoriesAPI = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addCategoryAPI = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateCategoryAPI = async ({ id, data }) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteCategoryAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// New API call for searching categories
export const searchCategoriesAPI = async (searchTerm) => {
  const response = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`);
  return response.data;
};
