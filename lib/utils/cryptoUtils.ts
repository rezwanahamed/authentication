
import CryptoJS from 'crypto-js';
import { envConfig } from '../lib/env';


// Secret key for AES encryption (in a real app, use an environment variable)
const SECRET_KEY = envConfig.ENCRYPTION_SECRET_KEY;
console.warn('SECRET_KEY' , SECRET_KEY)


// Encrypts a string using AES encryption
export const encryptData = (str: string) => {
  console.warn("lllll0", str)
  return CryptoJS.AES.encrypt(str, SECRET_KEY!)?.toString();
};

// Decrypts a string using AES encryption
export const decryptData = (str: string): string | null => {
  if (!SECRET_KEY) {
    console.error("SECRET_KEY is not defined.");
    return null; // Return null if SECRET_KEY is not available
  }

  try {
    const bytes = CryptoJS.AES.decrypt(str, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData || null; // Return null if decryption fails
  } catch (error) {
    console.error("Decryption failed:", error);
    return null; // Handle decryption errors gracefully
  }
};


