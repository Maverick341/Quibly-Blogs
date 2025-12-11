import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Protected, ErrorPage } from './Components';
import Layout from './Layout';
import Home from './Pages/Home';
import Post from './Pages/Post';
import EditPost from './Pages/EditPost';
import AddPost from './Pages/AddPost';
import AllPosts from './Pages/AllPosts';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import AuthCallback from './Pages/AuthCallback';

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
        element:(
            <Protected authentication={false}>
                <Login />
            </Protected>
        )
      },
      {
            path: "signup",
            element: (
                <Protected authentication={false}>
                    <Signup />
                </Protected>
            ),
        },
        {
            path: "all-posts",
            element: (
                <Protected authentication>
                    {" "}
                    <AllPosts />
                </Protected>
            ),
        },
        {
            path: "add-post",
            element: (
                <Protected authentication>
                    {" "}
                    <AddPost />
                </Protected>
            ),
        },
        {
            path: "edit-post/:slug",
            element: (
                <Protected authentication>
                    {" "}
                    <EditPost />
                </Protected>
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
  )
}

export default App