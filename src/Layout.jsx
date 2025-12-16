import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout, updateProfile } from "./store/authSlice";
import { Header, Footer } from "./Components";
import "./App.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import profileService from "./appwrite/profile";

function Layout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  // const navigate = useNavigate();

  // const authStatus = useSelector((state) => state.auth.status);

  const isLandingPage = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));

          profileService.getProfile(userData.$id).then((profile) => {
            if (profile) {
              dispatch(updateProfile({ profile }));
            }
          });
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // useEffect(() => {
  //   if (!loading && authStatus && location.pathname === "/") {
  //     navigate('/all-posts');
  //   }
  // }, [loading, authStatus, location.pathname, navigate]);

  if (loading && location.pathname !== "/") {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f4f0] text-[#1f2226] dark:bg-[#2a2d31] dark:text-[#e8e6e3]">
        <Loader className="size-10 animate-spin text-[#a8956b] dark:text-[#a8956b]" />
      </div>
    );
  }

  const shouldShowHeader = !isLandingPage && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f0] text-[#1f2226] dark:bg-[#2a2d31] dark:text-[#e8e6e3]">
      {shouldShowHeader && <Header />}
      <main className="grow">
        <Outlet />
      </main>
      {shouldShowHeader && <Footer />}
    </div>
  );
}

export default Layout;
