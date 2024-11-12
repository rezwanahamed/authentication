import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Base API URL from environment variables
  timeout: 10000, // Request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the session using next-auth
    const session = await getSession();
    console.warn("token from axios ===============================: ", session);

    // If session exists and has accessToken, add it to headers
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      signOut();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
