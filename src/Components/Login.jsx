import React from "react";
import { login as authLogin } from "@/store/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Input } from ".";
import authService from "@/appwrite/auth";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useOAuth } from "@/hooks/useOAuth";
import { OAuthProvider } from "appwrite";
import GithubLogo from "@/assets/github-mark-white.svg";
import GithubLogoDark from "@/assets/github-mark.svg";

function Login({ onToggle = () => {}, isDarkMode = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleOAuthSignup, authError, setAuthError } = useOAuth();

  const mode = useSelector((state) => state.theme.mode);
  isDarkMode = mode === "dark";

  const login = async (data) => {
    setAuthError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();

        if (userData) dispatch(authLogin({ userData }));
        navigate("/");
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <>
      <div className="max-w-sm mx-auto lg:mx-0 rounded-lg p-6 bg-[#f5f4f0] text-[#1f2226] dark:bg-[#2a2d31] dark:text-[#e8e6e3]">
        <h2 className="text-xl font-sans font-semibold mb-5 text-[#1f2226] dark:text-[#e8e6e3]">
          Please log in
        </h2>

        <form onSubmit={handleSubmit(login)} className="space-y-4">
          {/* Email field */}
          <div>
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
              errors={errors.email}
            />
          </div>

          {/* Password field */}
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: true,
                validate: {
                  minLength: (value) =>
                    value.length >= 8 ||
                    "Password must be at least 8 characters long",
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  hasLowerCase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                  hasNumber: (value) =>
                    /\d/.test(value) ||
                    "Password must contain at least one number",
                  hasSymbol: (value) =>
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ||
                    "Password must contain at least one special character",
                },
              })}
              errors={errors.password}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="px-4 py-2 text-sm bg-[#a8956b] hover:bg-[#8c7a57] text-[#2a2d31] font-sans font-semibold rounded-md transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[#a8956b] focus:ring-offset-2 focus:ring-offset-[#f5f4f0] dark:focus:ring-offset-[#2a2d31] cursor-pointer"
          >
            Log in
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#d5d2cc] dark:border-[#c5c3bf] opacity-50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#f5f4f0] dark:bg-[#2a2d31] px-2 text-[#4f5358] dark:text-[#c5c3bf]">or</span>
          </div>
        </div>

        {/* OAuth buttons*/}
        <div className="mt-10">
          <Button
            onClick={() =>
              handleOAuthSignup({
                provider: OAuthProvider.Github,
              })
            }
            className="px-4 py-2 text-sm bg-[#f0eeea] hover:bg-[#e7e4de] text-[#1f2226] dark:bg-white/5 dark:hover:bg-white/10 dark:text-[#c5c3bf] font-sans font-semibold rounded-md transition-colors shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] border border-[#d5d2cc] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c5c3bf]/40 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#f5f4f0] dark:focus:ring-offset-[#2a2d31] cursor-pointer flex items-center justify-center gap-2"
          >
            <img src={isDarkMode ? GithubLogo : GithubLogoDark} alt="GitHub" className="h-5 w-5" />
            <span>Continue with Github</span>
          </Button>
          {/* Add more OAuth providers if needed */}
        </div>

        {/* Toggle to signup */}
        {!isAuthPage ? (
          <div className="mt-5 text-center text-xs font-sans text-[#4f5358] dark:text-[#c5c3bf]">
            Don&apos;t have any account?&nbsp;
            <button
              onClick={onToggle}
              className="text-xs font-sans text-[#8c7a57] hover:text-[#7d6c4f] dark:text-[#a8956b] dark:hover:text-[#9a8760] transition-colors cursor-pointer"
            >
              Sign up
            </button>
            {/* {" if not registered yet"} */}
          </div>
        ) : (
          <div className="mt-5 text-center text-xs font-sans text-[#4f5358] dark:text-[#c5c3bf]">
            Don&apos;t have any account?&nbsp;
            <Link
            to="/signup"
              className="text-xs font-sans text-[#8c7a57] hover:text-[#7d6c4f] dark:text-[#a8956b] dark:hover:text-[#9a8760] transition-colors cursor-pointer"
            >
              Sign up
            </Link>
          </div>
        )}

        {authError && (
          <p className="text-red-600 mt-8 text-center">{authError}</p>
        )}
      </div>
    </>
  );
}

export default Login;
