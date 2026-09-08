import axios from "axios";

const API = axios.create({
  baseURL: "https://saliha-s-beauty-website.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;