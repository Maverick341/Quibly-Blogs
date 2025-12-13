import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <p className="text-gray-600">Redirecting to signup...</p>
          </div>
        ) : (
          <div>
            <p className="text-lg">Completing authentication...</p>
            <div className="mt-4">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCallback;
