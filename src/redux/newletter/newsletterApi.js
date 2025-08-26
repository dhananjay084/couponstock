// src/redux/newsletter/newsletterAPI.js
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/api/subscribe`;

export const subscribeUserAPI = (emailData) => {
  return axios.post(API_URL, emailData);
};
