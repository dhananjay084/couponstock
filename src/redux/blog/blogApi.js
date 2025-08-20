import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://localhost:5000/api/blogs'; // Update if needed
=======
const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs`;// Update if needed
>>>>>>> 81aac881e51f56a2eff8a14129d6851d7821b1e4

export const getAllBlogs = () => axios.get(API_URL);
export const addBlog = (data) => axios.post(API_URL, data);
export const editBlog = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const removeBlog = (id) => axios.delete(`${API_URL}/${id}`);
export const getBlogById = (id) => axios.get(`${API_URL}/${id}`);
