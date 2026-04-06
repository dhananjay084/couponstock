import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deals`; // adjust for production if needed

export const getAllDeals = async (country) => {
  const params = country ? { country } : undefined;
  const response = await axios.get(BASE_URL, { params });
  return response.data;
};

export const createDeal = async (deal) => {
  const response = await axios.post(BASE_URL, deal);
  return response.data;
};

export const bulkCreateDeals = async (deals) => {
  const response = await axios.post(`${BASE_URL}/bulk`, { deals });
  return response.data;
};

export const deleteDealById = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateDealById = async (id, data) => {
  const response = await axios.patch(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const getDealById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  };

// New API call for searching deals
export const searchDeals = async (searchTerm, country) => {
  // Make sure to encode the search term for URL safety
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      q: searchTerm,
      ...(country ? { country } : {}),
    },
  });
  return response.data;
};
