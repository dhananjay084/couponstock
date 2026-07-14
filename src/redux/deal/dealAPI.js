import axios from 'axios';
import { buildPublicApiUrl } from "../../lib/publicApiBase";

const BASE_URL = buildPublicApiUrl("/api/deals");

export const getAllDeals = async () => {
  const response = await axios.get(BASE_URL);
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
export const searchDeals = async (searchTerm) => {
  // Make sure to encode the search term for URL safety
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      q: searchTerm,
    },
  });
  return response.data;
};
