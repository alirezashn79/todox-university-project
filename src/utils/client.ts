import axios from "axios";
import baseURL from "./baseUrl";
import toast from "react-hot-toast";

const client = axios.create({
  baseURL,
});

client.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest.url.includes("sms") &&
      originalRequest.url !== "api/user"
    ) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
        try {
          const res = await axios.get("/api/auth/refresh-server");
          toast.success(res.data.message);
          return client(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          toast.error("لاگین نیستید");
          return Promise.reject(refreshError);
        }
      }
    }

    toast.error(
      `${error.response.data.message} - code:${error.response.status}`
    );
    return Promise.reject(error);
  }
);

export default client;
