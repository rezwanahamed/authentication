import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

// Define a type for the delete response
interface DeleteResponse {
  message: string; // Adjust according to your API's response structure
}

type DeleteDataHook = {
  deleteData: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  response: DeleteResponse | null; // Use the specific response type
};

export const useDeleteData = (): DeleteDataHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<DeleteResponse | null>(null); // Use the specific response type

  const deleteData = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.delete(url);
      setResponse(res.data); // Store the response
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong"); // Handle errors
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return { deleteData, isLoading, error, response };
};
