import axios from "axios";
import { FireToast } from "./toast";

const client = axios.create({
  baseURL: "/",
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
          await axios.get("/api/auth/refresh-server");
          // toast.success(res.data.message, {
          //   style: {
          //     backgroundColor: theme === "dark" ? "#1d232a" : undefined,
          //     color: theme === "dark" ? "#a6adbb" : undefined,
          //     border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
          //   },
          // });
          return client(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          FireToast({ type: "error", message: "لاگین نیستید." });
          return Promise.reject(refreshError);
        }
      }
    }

    FireToast({
      type: "error",
      message: `${error.response.data.message} - code:${error.response.status}`,
    });
    return Promise.reject(error);
  }
);

export default client;
