import React, { useEffect, useState } from "react";
import postService from "@/appwrite/post";
import {
  Container,
  PostCard,
  Button,
  LoginComponent,
  SignupComponent,
} from "@/Components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setPosts } from "@/store/postSlice";

function Home() {
  const [authMode, setAuthMode] = useState("signup");
  const dispatch = useDispatch();
  
  // const [posts, setPosts] = useState([]);

  // const posts = useSelector((state) => state.post.posts);
  // const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    postService.getPosts([]).then((posts) => {
      if (posts) {
        dispatch(setPosts({ posts: posts.rows }));
        // setPosts(posts.rows);
      }
    });
  }, []);

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen bg-[#2a2d31] text-[#e8e6e3] font-sans">
      <Container>
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="flex items-center min-h-[500px] ">
              <div className="space-y-6">
                {/* Hero heading */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-sans font-bold text-[#e8e6e3] mb-4 text-balance">
                    Quibly
                  </h1>
                  {/* Description paragraph */}
                  <p className="text-sm text-[#c5c3bf] leading-relaxed mb-6 text-pretty">
                    Quibly is a calm, minimal space for writers and readers who
                    care about ideas more than noise.
                  </p>
                  {/* Philosophy paragraph */}
                  <div className="text-sm text-[#c5c3bf] leading-relaxed space-y-3 text-pretty">
                    <p>
                      Built around clarity and focus, Quibly removes distractions
                      so your thoughts can take center stage.
                    </p>
                    <p>
                      Write freely, publish effortlessly, and read without
                      interruption — just words, exactly as they were meant to be.
                    </p>
                  </div>
                </div>
                {/* Inspirational closing section */}
                <div className="pt-6 border-t border-[#3f4347]">
                  <p className="text-base font-sans text-[#e8e6e3] leading-relaxed text-balance">
                    Think deeply. Write simply. Let your ideas live.
                  </p>
                  <p className="text-base font-sans text-[#a8956b] mt-2">
                    That's Quibly.
                  </p>
                </div>
              </div>
            </div>
            {/* Middle Column - Auth Card */}
            <div className="lg:sticky lg:top-20">
              {authMode === "login" ? (
                <LoginComponent onToggle={toggleAuthMode} />
              ) : (
                <SignupComponent onToggle={toggleAuthMode} />
              )}
            </div>
            {/* Right Column - Empty space */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Home;
