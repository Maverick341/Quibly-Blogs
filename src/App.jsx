import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute, ErrorPage } from "./Components";
import Layout from "./Layout";
import Landing from "./Pages/Landing";
import Post from "./Pages/Post";
import EditPost from "./Pages/EditPost";
import AddPost from "./Pages/AddPost";
import AllPosts from "./Pages/AllPosts";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import UserPosts from "./Pages/UserPosts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute authentication={false}>
            <Landing />
          </ProtectedRoute>
        ),
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
        path: "user-posts",
        element: (
          <ProtectedRoute authentication>
            <UserPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: "post/:slug",
        element: (
          <ProtectedRoute authentication>
            <Post />
          </ProtectedRoute>
        ),
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
