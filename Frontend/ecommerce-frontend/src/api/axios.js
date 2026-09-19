import axios from "axios";

const API = axios.create({
  baseURL: "https://saliha-s-beauty-website.vercel.app/api",
  withCredentials: true, // 👈 FIX 1: Mandatory for cross-domain sessions/cookies between frontend and backend
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 FIX 2: Automatic Token Injection Interceptor
// This interceptor automatically attaches your JWT token to secure authorization requests
API.interceptors.request.use(
  (config) => {
    // Check for token in localStorage (adjust key name if yours is different, e.g., 'token')
    const token = localStorage.getItem("token") || localStorage.getItem("userToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
