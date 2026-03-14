import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || 
            (localStorage.getItem("auth-storage") ? JSON.parse(localStorage.getItem("auth-storage") as string)?.state?.token : null);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API Error]", err.response?.status, err.message);
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const getProducts = () => api.get("/products").then((r) => r.data);
export const getInventory = () => api.get("/inventory").then((r) => r.data);
export const getDeliveries = () => api.get("/deliveries").then((r) => r.data);
export const getReceipts = () => api.get("/receipts").then((r) => r.data);
export const getMovements = () => api.get("/movements").then((r) => r.data);

export default api;
