import { useState } from "react";
import authService from "@/appwrite/auth";

export const useOAuth = () => {
  const [error, setError] = useState("");

  const handleOAuthSignup = async ({ provider }) => {
    setError("");
    
    try {
      await authService.OAuth2SignUp({
        provider,
      });
      // OAuth redirect happens here - session is created by Appwrite
    } catch (error) {
      setError(error.message || "OAuth signup failed. Please try again.");
    }
  };

  return { handleOAuthSignup, error, setError };
};