import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API Error]", err.response?.status, err.message);
    return Promise.reject(err);
  }
);

export const getProducts = () => api.get("/api/products").then((r) => r.data);
export const getInventory = () => api.get("/api/inventory").then((r) => r.data);
export const getDeliveries = () => api.get("/api/deliveries").then((r) => r.data);
export const getReceipts = () => api.get("/api/receipts").then((r) => r.data);
export const getMovements = () => api.get("/api/movements").then((r) => r.data);

export default api;
