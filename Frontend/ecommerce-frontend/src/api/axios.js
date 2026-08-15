import axios from "axios";

const API = axios.create({
  baseURL:
    "https://saliha-s-beauty-full-stack-websites-seven.vercel.app/api",
  withCredentials: true,
});

export default API;