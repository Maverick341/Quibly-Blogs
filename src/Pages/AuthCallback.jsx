import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authService from "@/appwrite/auth";
import { login } from "@/store/authSlice";

function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const userId = searchParams.get("userId");
        const secret = searchParams.get("secret");

        if (!userId || !secret) {
          setError("Invalid callback parameters");
          setTimeout(() => navigate("/signup"), 2000);
          return;
        }

        // Create session with OAuth token
        const user = await authService.handleOAuth2Callback(userId, secret);

        if (user) {
          // Dispatch login to Redux
          dispatch(login({ userData: user }));
          // Redirect to home
          navigate("/all-posts");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/signup"), 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  const isDark = useSelector((state) => state.theme.mode === "dark");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0] dark:bg-[#2a2d31] text-[#1f2226] dark:text-[#e8e6e3]">
      <div className="text-center">
        {error ? (
          <div>
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <p className="text-[#4f5358] dark:text-[#c5c3bf]">Redirecting to signup...</p>
          </div>
        ) : (
          <div>
            <p className="text-lg mb-4">Completing authentication...</p>
            <div className="mt-4">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-[#e5e4e0] dark:border-[#4a4d52] border-t-[#a8956b] rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallback;
