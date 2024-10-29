import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.message === "Token expired" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/refresh-token`, {}, { withCredentials: true });
        
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token expired or invalid. Redirecting to login...");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 403) {
      console.error("Access forbidden or refresh token invalid. Redirecting to login...");
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
