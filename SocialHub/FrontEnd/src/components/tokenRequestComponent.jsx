// axiosInstance.js

import axios from 'axios';
import Cookies from 'js-cookie';

const tokenRequestComponent = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

tokenRequestComponent.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default tokenRequestComponent;
