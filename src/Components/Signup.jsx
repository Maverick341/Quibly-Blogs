import React from "react";
import authService from "@/appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/store/authSlice";
import { Button, Input, Logo } from ".";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useOAuth } from "@/hooks/useOAuth";
import { OAuthProvider } from "appwrite";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const { handleOAuthSignup, error, setError } = useOAuth();

  const create = async (data) => {
    setError("");

    try {
      const userAccount = await authService.createAccount(data);

      if (userAccount) {
        const userData = await authService.getCurrentUser();

        if (userData) {
          dispatch(login({ userData }));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Full Name: "
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
                validate: {
                  minLength: (value) =>
                    value.trim().length >= 3 ||
                    "Name must be at least 3 characters long",
                  noSpecialChars: (value) =>
                    /^[a-zA-Z\s]+$/.test(value) ||
                    "Name should only contain letters and spaces",
                  noMultipleSpaces: (value) =>
                    !/\s{2,}/.test(value) ||
                    "Please avoid multiple consecutive spaces",
                  validFormat: (value) => {
                    const trimmed = value.trim();
                    const words = trimmed
                      .split(" ")
                      .filter((word) => word.length > 0);
                    if (words.length > 1) {
                      return (
                        words.every((word) => word.length >= 2) ||
                        "Each name should be at least 2 characters long"
                      );
                    }
                    return true;
                  },
                },
              })}
            />
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
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
            />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-100 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth buttons*/}
        <div className="mt-8">
          <Button
            onClick={() =>
              handleOAuthSignup({
                provider: OAuthProvider.Github,
              })
            }
            className="w-full"
          >
            Continue with Github
          </Button>
          {/* Add more OAuth providers if needed */}
        </div>
      </div>
    </div>
  );
}

export default Signup;
