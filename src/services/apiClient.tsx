import axios from "axios";

export const peakLimsBff = axios.create({
  baseURL: "/bff",
  headers: {
    "X-CSRF": "1",
  },
});

export const peakLimsApi = axios.create({
  baseURL: "/api",
  headers: {
    "X-CSRF": "1",
  },
});

// peakLimsApi.interceptors.request.use(
//   (config) => {
//     // Do something before request is sent
//     return config;
//   },
//   (error) => {
//     // Handle request error
//     return Promise.reject(error);
//   }
// );

// peakLimsApi.interceptors.response.use(
//   (response) => {
//     // Do something with the response data
//     return response;
//   },
//   (error) => {
//     // Handle response error
//     return Promise.reject(error);
//   }
// );
