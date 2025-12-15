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
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#2a2d31]">
      {/* Hero Section */}
      <div className="bg-[#e8e6e3] dark:bg-[#1f2226] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f2226] dark:text-[#e8e6e3] mb-6">
            Welcome to Quibly, {userData?.name || "Writer"}
          </h1>
          <p className="text-xl text-[#4f5358] dark:text-[#c5c3bf] mb-10 max-w-2xl mx-auto">
            Join a growing community of thinkers, storytellers, and creators — start writing today.
          </p>
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <Button
              onClick={() => navigate("/add-post")}
              className="bg-[#a8956b] hover:bg-[#8f7d5a] text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors w-auto cursor-pointer"
            >
              Write a Post
            </Button>
            <Button
              onClick={() => {/* Dummy button */}}
              className="bg-[#4f5358] hover:bg-[#5f6469] text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors w-auto cursor-pointer"
            >
              View your posts
            </Button>
          </div>
        </div>
      </div>

      {/* All Stories Section */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1f2226] dark:text-[#e8e6e3] mb-12">
            View All Posts
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
