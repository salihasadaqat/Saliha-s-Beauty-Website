import axios from "axios";

const API = axios.create({
  baseURL: "https://salihas-beauty111.vercel.app/",
  withCredentials: true,
});

export default API;