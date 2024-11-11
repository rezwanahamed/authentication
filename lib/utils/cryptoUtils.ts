import CryptoJS from "crypto-js";
import { envConfig } from "../lib/env";

const SECRET_KEY = envConfig.ENCRYPTION_SECRET_KEY;

// Custom Base64 encoder/decoder that replaces URL-unsafe characters
const makeUrlSafe = (str: string): string => {
  return str
    .replace(/\//g, "_") // Replace / with _
    .replace(/\+/g, "-") // Replace + with -
    .replace(/=/g, "."); // Replace = with .
};

const revertUrlSafe = (str: string): string => {
  return str
    .replace(/_/g, "/") // Revert _ back to /
    .replace(/-/g, "+") // Revert - back to +
    .replace(/\./g, "="); // Revert . back to =
};

// Encrypts a string using AES encryption and makes it URL-safe
export const encryptData = (data: any): string => {
  if (!data) return "";

  const jsonString = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY!).toString();
  return makeUrlSafe(encrypted);
};

// Decrypts a URL-safe encrypted string
export const decryptData = (data: any): string | null => {
  if (!data) return null;
  if (!SECRET_KEY) {
    console.error("SECRET_KEY is not defined.");
    return null;
  }

  try {
    const normalizedStr = revertUrlSafe(data);
    const bytes = CryptoJS.AES.decrypt(normalizedStr, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);

    return parsedData || null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// Helper function to check if a string is encrypted
export const isEncrypted = (str: string): boolean => {
  try {
    const normalizedStr = revertUrlSafe(str);
    return (
      normalizedStr.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(normalizedStr)
    );
  } catch {
    return false;
  }
};
