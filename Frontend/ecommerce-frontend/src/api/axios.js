import axios from "axios";

const API = axios.create({
  baseURL: "https://saliha-s-beauty-website.vercel.app/",
  withCredentials: true,
});

export default API;