import { Notification } from "@/components/notifications";
import axios from "axios";
import { login } from "./auth";

export const peakLimsBff = axios.create({
  baseURL: "/bff",
  headers: {
    "X-CSRF": "1",
  },
  withCredentials: true,
});

export const peakLimsApi = axios.create({
  baseURL: "/api",
  headers: {
    "X-CSRF": "1",
  },
  withCredentials: true,
});

peakLimsBff.interceptors.response.use(
  (response) => response,
  async (error) => {
    commonRejection(error);
  }
);

peakLimsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    commonRejection(error);
  }
);

function commonRejection(error: any) {
  // if (error.response) {
  //   // The request was made and the server responded with a status code
  //   // that falls out of the range of 2xx
  //   console.error(
  //     error.response.status,
  //     error.response.data,
  //     error.response.headers
  //   );
  // } else if (error.request) {
  //   // The request was made but no response was received
  //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //   // http.ClientRequest in node.js
  //   console.error(error.request);
  // }

  if (error && error.response && error.response.status === 401) {
    login();
  }
  // console.log((error && error.toJSON && error.toJSON()) || undefined);

  // return Promise.reject(error);
  const statusCode = error?.response?.status;

  if (statusCode === 422 || statusCode === 400 || statusCode === 500) {
    const detailMessage =
      error.response.data.detail || "An unknown error occurred.";
    Notification.error(`${detailMessage}`);
  }

  throw error;
}
