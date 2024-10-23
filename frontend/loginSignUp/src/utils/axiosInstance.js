import axios from "axios";
import { BASE_URL } from "./constants";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const navigate = useNavigate();

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axiosInstance.post("/refresh-token");
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest); // Retry the original request
        }
      } catch (err) {
        localStorage.clear();
        navigate("/login"); // Navigate to login page if token refresh fails
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
