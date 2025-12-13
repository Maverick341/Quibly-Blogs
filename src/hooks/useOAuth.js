import { useState } from "react";
import authService from "@/appwrite/auth";

export const useOAuth = () => {
  const [authError, setAuthError] = useState("");

  const handleOAuthSignup = async ({ provider }) => {
    setAuthError("");
    
    try {
      await authService.OAuth2SignUp({
        provider,
      });
      // OAuth redirect happens here - session is created by Appwrite
    } catch (error) {
      setAuthError(error.message || "OAuth signup failed. Please try again.");
    }
  };

  return { handleOAuthSignup, authError, setAuthError };
};