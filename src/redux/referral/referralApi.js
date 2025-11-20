import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/referral`;

// axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ send cookies automatically
});

// GET referral link for logged-in user
export const getReferralLink = async () => {
  const res = await api.get("/generate");
  return res.data;
};

// Register new user via referral
export const registerWithReferral = async (userData) => {
  const res = await api.post("/register", userData);
  return res.data;
};

// Get list of referred users for the current user
export const getMyReferrals = async () => {
  const res = await api.get("/my-referrals");
  return res.data;
};
