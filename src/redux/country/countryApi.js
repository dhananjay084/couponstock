import axios from "axios";

const BASE_URL = "http://localhost:5000/api/countries"; // adjust if needed

export const getAllCountriesApi = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addCountryApi = async (country_name) => {
  const response = await axios.post(BASE_URL, { country_name });
  return response.data;
};

export const deleteCountryApi = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
