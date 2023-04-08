import axios from "axios";
import HandleError from "./HandleError";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";
import { store } from "../redux/store";
import { CreateToast } from "./Toast";

// Create an axios instance with default configuration
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to handle HTTP requests before they are sent
// instance.interceptors.request.use(
//   (req) => {
//     // Do something before sending the request
//     return req;
//   },
//   (error) => {
//     // Do something with the request error
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor to handle HTTP responses before they are returned to the application
instance.interceptors.response.use(
  (response) => {
    // Do something with the response data
    return response;
  },
  (error) => {
    HandleError(error, (error) => {
      store.dispatch(logoutSuccess());
    });
    if (error.code === "ECONNABORTED") {
      CreateToast("Timeouterror", "Timeout error", "error");
    }
    if (error.code === "ERR_NETWORK") {
      CreateToast("Networkerror", "Network error", "error");
      console.log("Network error occurred.");
    }
    console.log("Error", error);
    return Promise.reject(error);
  }
);

export default instance;
