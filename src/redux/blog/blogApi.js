import axios from 'axios';

const API_URL = 'https://mycouponstock-production.up.railway.app
/api/blogs'; // Update if needed

export const getAllBlogs = () => axios.get(API_URL);
export const addBlog = (data) => axios.post(API_URL, data);
export const editBlog = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const removeBlog = (id) => axios.delete(`${API_URL}/${id}`);
export const getBlogById = (id) => axios.get(`${API_URL}/${id}`);
