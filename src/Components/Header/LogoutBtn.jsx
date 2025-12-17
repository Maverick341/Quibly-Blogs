import React from "react";
import { useDispatch } from "react-redux";
import authService from "@/appwrite/auth";
import { logout } from "@/store/authSlice";
import { clearAllPosts } from "@/store/postSlice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
      dispatch(clearAllPosts());
    });
  };
  return (
    <button
      onClick={logoutHandler}
      className="inline-block px-4 py-2 text-sm font-sans cursor-pointer text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors duration-150 ease-out rounded-md hover:bg-black/5 dark:hover:bg-white/5"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
