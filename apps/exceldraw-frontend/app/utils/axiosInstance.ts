import axios from "axios";
import { HTTP_BACKEND } from "@/config";

const axiosInstance = axios.create({
  baseURL: HTTP_BACKEND,
});

// Automatically attach token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosInstance;
