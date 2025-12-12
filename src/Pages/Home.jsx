import React, { useEffect, useState } from "react";
import postService from "@/appwrite/post";
import { Container, PostCard, Button } from "@/Components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    postService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.rows);
      }
    });
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Share Your Stories,
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                {" "}Inspire the World
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of writers and readers. Create, share, and discover amazing stories that matter.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {authStatus ? (
                <Link to="/add-post">
                  <Button
                    bgColor="bg-linear-to-r from-blue-600 to-purple-600"
                    className="text-lg px-8 py-3 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Create Your Story
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button
                      bgColor="bg-linear-to-r from-blue-600 to-purple-600"
                      className="text-lg px-8 py-3 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      bgColor="bg-white"
                      textColor="text-gray-800"
                      className="text-lg px-8 py-3 border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Posts Section */}
      <div className="py-16 px-4">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {posts.length === 0 ? "Welcome to Quibly" : "Latest Stories"}
            </h2>
            <p className="text-gray-600 text-lg">
              {posts.length === 0
                ? "Be the first to share your story"
                : "Discover amazing content from our community"}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  No Stories Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  {authStatus
                    ? "Be the first to share your amazing story with the community!"
                    : "Join our community to read and share inspiring stories."}
                </p>
                {authStatus ? (
                  <Link to="/add-post">
                    <Button
                      bgColor="bg-blue-600"
                      className="px-6 py-3 hover:bg-blue-700 transition-colors"
                    >
                      Write Your First Story
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button
                      bgColor="bg-blue-600"
                      className="px-6 py-3 hover:bg-blue-700 transition-colors"
                    >
                      Join Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div
                  key={post.$id}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <PostCard {...post} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>

      {/* CTA Section - Only for non-authenticated users */}
      {!authStatus && (
        <div className="bg-linear-to-r from-blue-600 to-purple-600 py-16 px-4">
          <Container>
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of writers who are already sharing their passion and inspiring others.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/signup">
                  <Button
                    bgColor="bg-white"
                    textColor="text-blue-600"
                    className="text-lg px-8 py-3 hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    Start Writing Today
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    bgColor="bg-transparent"
                    className="text-lg px-8 py-3 border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                  >
                    I Have an Account
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

export default Home;
