import React, { useEffect } from "react";
import postService from "@/appwrite/post";
import { PostCard, Button } from "@/Components";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/store/postSlice";
import { useNavigate } from "react-router-dom";

function AllPosts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.post.posts);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    postService.getPosts([]).then((posts) => {
      if (posts) {
        dispatch(setPosts({ posts: posts.rows }));
      }
    });
  }, []);

  return (
    <div className="bg-[#f5f4f0] dark:bg-[#2a2d31]">
      {/* Hero Section */}
      <div className="py-20 px-6 bg-linear-to-b from-[#dedad5] to-[#f5f4f0] dark:from-[#1a1d21] dark:to-[#2a2d31]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-normal text-[#1f2226] dark:text-[#e8e6e3] mb-4">
            Welcome to Quibly, {userData?.name || "Writer"}
          </h1>
          <p className="text-lg text-[#6a6e73] dark:text-[#9aa0a6] mb-8 max-w-2xl mx-auto font-light">
            Join a growing community of thinkers, storytellers, and creators — start writing today.
          </p>
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => navigate("/add-post")}
              className="border border-[#a8956b] text-[#a8956b] hover:bg-[#a8956b] hover:text-white px-6 py-2 text-sm font-normal transition-all cursor-pointer"
            >
              Write a Post
            </button>
            <button
              onClick={() => {/* Dummy button */}}
              className="border border-[#d0cdc7] dark:border-[#5a5d61] text-[#6a6e73] dark:text-[#9aa0a6] hover:border-[#a8a5a0] dark:hover:border-[#7a7d81] px-6 py-2 text-sm font-normal transition-all cursor-pointer"
            >
              View your posts
            </button>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="max-w-4xl mx-auto px-6">
        <hr className="border-t border-[#d0cdc7] dark:border-[#3a3d41] opacity-80" />
      </div>

      {/* All Stories Section */}
      <div className="py-16 px-6 pb-0 bg-linear-to-b from-[#f5f4f0] to-[#eeede8] dark:from-[#2a2d31] dark:to-[#25282c]">
        <div className="max-w-7xl mx-auto pb-16">
          <h2 className="text-3xl font-normal text-[#1f2226] dark:text-[#e8e6e3] mb-18 text-center italic">
            Stories from our community
          </h2>
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#4f5358] dark:text-[#c5c3bf]">
              No posts yet. Be the first to share your story!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default AllPosts;
