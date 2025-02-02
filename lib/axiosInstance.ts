import axios from "axios";
import { getSession, signIn, signOut } from "next-auth/react";
import { apiUrls } from "./config/apiUrls";
import { envConfig } from "./config/env";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
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
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        const session = await getSession();

        if (!session?.refreshToken) {
          // No refresh token available, sign out the user
          await signOut();
          return Promise.reject(error);
        }

        // Call your backend API to refresh the access token
        const refreshResponse = await axios.post(
          envConfig.BACKEND_SERVER_URL + apiUrls.AUTH.REFRESH_TOKEN,
          {
            refreshToken: session.refreshToken, // Ensure refreshToken is passed
          },
        );

        if (refreshResponse.status === 200) {
          // alert("Access token refreshed successfully");
          const newAccessToken = refreshResponse.data.accessToken;
          const newRefreshToken = refreshResponse.data.refreshToken;

          // Update the session using the `signIn` method
          const result = await signIn("credentials", {
            redirect: false,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            userId: session.user.userId, // Include any other required user data
            email: session.user.email,
            userRole: session.user.userRole,
          });

          if (result?.error) {
            // If updating the session fails, sign out the user
            console.error("Error updating session:", result.error);
            await signOut();
            return Promise.reject(result.error);
          }

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing access token:", refreshError);
        await signOut();
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the request
    return Promise.reject(error);
  },
);

export default axiosInstance;
