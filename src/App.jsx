import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute, ErrorPage } from "./Components";
import Layout from "./Layout";
import Home from "./Pages/Home";
import Post from "./Pages/Post";
import EditPost from "./Pages/EditPost";
import AddPost from "./Pages/AddPost";
import AllPosts from "./Pages/AllPosts";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import AuthCallback from "./Pages/AuthCallback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <ProtectedRoute authentication={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <ProtectedRoute authentication={false}>
            <Signup />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-posts",
        element: (
          <ProtectedRoute authentication>
            {" "}
            <AllPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-post",
        element: (
          <ProtectedRoute authentication>
            {" "}
            <AddPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-post/:slug",
        element: (
          <ProtectedRoute authentication>
            {" "}
            <EditPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "post/:slug",
        element: <Post />,
      },
      {
        path: "auth/callback",
        element: <AuthCallback />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
