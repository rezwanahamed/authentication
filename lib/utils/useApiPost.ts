import { useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { AxiosError } from "axios";

export const usePostData = <T = any>() => {
  const [isLoading, setIsLoading] = useState(false);

  const postData = async (url: string, data: T) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post(url, data);
      return res;
    } catch (err) {
      const axiosError = err as AxiosError;
      throw axiosError;  // Re-throw the error
    } finally {
      setIsLoading(false);
    }
  };

  return { postData, isLoading };
};