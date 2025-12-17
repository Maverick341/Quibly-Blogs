import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "@/appwrite/auth";
import { login } from "@/store/authSlice";

function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      try {
        // Session is already created by Appwrite
        const user = await authService.handleOAuth2Callback();

        if (!isMounted) return;

        // Save user in Redux
        dispatch(login({ userData: user }));

        // Clean redirect
        navigate("/all-posts", { replace: true });
      } catch (err) {
        console.error("OAuth callback error:", err);

        if (!isMounted) return;

        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/signup", { replace: true }), 2000);
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0] dark:bg-[#2a2d31] text-[#1f2226] dark:text-[#e8e6e3]">
      <div className="text-center">
        {error ? (
          <div>
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">
              {error}
            </p>
            <p className="text-[#4f5358] dark:text-[#c5c3bf]">
              Redirecting to signup...
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg mb-4">Completing authentication…</p>
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
