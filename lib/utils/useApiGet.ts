import axiosInstance from "@/lib/lib/axiosInstance";
import { useState } from "react";

// Define a generic type for the hook to accept different response types
type GetDataHook<T> = {
  getData: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  data: T | null;
};

export const useGetData = <T = any>(): GetDataHook<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const getData = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get(url);
      setData(res.data); // Store the response data
    } catch (err: any) {
      setError(err); // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  return { getData, isLoading, error, data };
};
