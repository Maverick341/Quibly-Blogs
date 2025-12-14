import React from "react";
import { useDispatch } from "react-redux";
import authService from "@/appwrite/auth";
import { logout } from "@/store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
    });
  };
  return (
    <button
      onClick={logoutHandler}
      className="inline-block px-4 py-2 text-sm font-sans cursor-pointer text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150 ease-out rounded-md hover:bg-white/5"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
