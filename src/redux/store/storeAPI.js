import axios from 'axios';

const BASE_URL = 'https://mycouponstock-production.up.railway.app
/api/stores';

export const getStoresAPI = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addStoreAPI = async (storeData) => {
  const response = await axios.post(BASE_URL, storeData);
  return response.data;
};

export const deleteStoreAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateStoreAPI = async ({ id, data }) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};
export const getStoreByIdAPI = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  };
  
// New API call for searching stores
export const searchStoresAPI = async (searchTerm) => {
  // Make sure to encode the search term for URL safety
  const response = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`);
  return response.data;
};
