// /services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

export const api = {
  post: (url: string, data?: any) => API.post(url, data),
  get: (url: string) => API.get(url),
  put: (url: string, data?: any) => API.put(url, data),
  delete: (url: string) => API.delete(url),
};