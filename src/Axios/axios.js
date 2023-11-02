import Axios from "axios"
import { Store } from "../Redux/Store";
const axiosInstance = Axios.create({
    baseURL: "https://pdf-extractor-server-0z09.onrender.com/",
    headers: {
      "Content-Type": "application/json",
    },
  });
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = Store.getState().user.Token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
export default axiosInstance
