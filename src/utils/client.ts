import axios from "axios";
import baseURL from "./baseUrl";
import toast from "react-hot-toast";

const client = axios.create({
  baseURL,
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      toast.error(error.response.data.message);
    }
  }
);

export default client;
