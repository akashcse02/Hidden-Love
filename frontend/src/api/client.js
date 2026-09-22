import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Hidden Love";

const api = axios.create({ baseURL: API_URL });

// Attach the saved token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token has expired or is invalid, clear it so the app returns to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("hl_token");
    }
    return Promise.reject(error);
  }
);

export function mediaUrl(fileId) {
  return `${API_URL}/posts/media/${fileId}`;
}

export function avatarUrl(fileId) {
  return fileId ? `${API_URL}/posts/media/${fileId}` : null;
}

export default api;
