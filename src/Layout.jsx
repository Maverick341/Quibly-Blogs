import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./Components";
import "./App.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

function Layout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);

  const isLandingPage = location.pathname === "/"

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && authStatus && location.pathname === "/") {
      navigate('/all-posts');
    }
  }, [loading, authStatus, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const shouldShowHeader = !isLandingPage;

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        {shouldShowHeader && <Header />}
        <main>
          <Outlet />
        </main>
        {shouldShowHeader && <Footer />}
      </div>
    </div>
  );
}

export default Layout;
