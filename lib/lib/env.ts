export const envConfig = Object.freeze({
    // Client configuration
    ENCRYPTION_SECRET_KEY: process.env.NEXT_PUBLIC_API_URL as string,
  
    // Server configuration
    BACKEND_SERVER_URL: process.env.NEXT_PUBLIC_API_URL as string,
  });
  
  