import { useCallback, useEffect, useState } from "react";
import authService from "@/appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  login as authLogin,
  logout as authLogout,
  updateProfile,
} from "@/store/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { userData, status } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const checkSession = useCallback(
    async (data) => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));

          if (data !== undefined) {
            dispatch(
              updateProfile({
                profile: {
                  name: data.name,
                  age: data.age ? Number(data.age) : null,
                  bio: data.bio || "",
                  avatar: null,
                },
              })
            );
          }
        }
      } catch {
        dispatch(authLogout());
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signupWithEmailPassword = async (data) => {
    setAuthError("");
    setLoading(true);

    try {
      const session = await authService.createAccount(data);
      if (session) {
        await checkSession(data);
      }
    } catch (error) {
      setAuthError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmailPassword = async (data) => {
    setAuthError("");
    setLoading(true);
    try {
      const session = await authService.login(data);
      if (session) {
        await checkSession();
      }
    } catch (error) {
      setAuthError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async ({ provider }) => {
    setAuthError("");
    setLoading(true);

    try {
      await authService.OAuth2SignUp({
        provider,
      });
    } catch (error) {
      setAuthError(error.message || "OAuth signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    loading,
    setLoading,
    handleOAuthSignup,
    loginWithEmailPassword,
    signupWithEmailPassword,
    status,
    authError,
  };
};
