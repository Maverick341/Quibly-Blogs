import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // TODO: make it more easy to understand

    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/all-posts");
    }

    setLoader(false);
  }, [authStatus, navigate, authentication]);
  return loader ? (
    <div className="flex items-center justify-center h-screen bg-background">
      <Loader className="size-10 animate-spin text-primary" />
    </div>
  ) : (
    <>{children}</>
  );
}
