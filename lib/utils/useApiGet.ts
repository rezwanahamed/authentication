import axiosInstance from "../lib/axiosInstance";

// Example usage
export const fetchData = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
    // Handle response
  } catch (error) {
    console.error(error);
    // Handle error
  }
};
