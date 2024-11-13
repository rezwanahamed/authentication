import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

type UpdateDataHook<T> = {
  updateData: (url: string, data: T) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  response: any;
};

export const useUpdateData = <T = any>(): UpdateDataHook<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const updateData = async (url: string, data: T) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.put(url, data);
      setResponse(res.data); // Store the response
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong"); // Handle errors
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return { updateData, isLoading, error, response };
};
