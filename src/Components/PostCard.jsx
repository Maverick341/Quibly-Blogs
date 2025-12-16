import React, { useEffect, useState } from "react";
import postService from "@/appwrite/post";
import profileService from "@/appwrite/profile";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function PostCard({ $id, title, subtitle = "This is a subtitle", featuredImage, userId, $createdAt }) {
  const [authorName, setAuthorName] = useState("Anonymous");
  const isDark = useSelector((state) => state.theme.mode === "dark");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const profile = await profileService.getProfile(userId);
        if (profile?.name) {
          setAuthorName(profile.name);
        }
      } catch (error) {
        console.log("Error fetching author:", error);
      }
    };

    if (userId) {
      fetchAuthor();
    }
  }, [userId]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <Link to={`/post/${$id}`}>
      <article className="group cursor-pointer border border-[#d0cdc7] dark:border-[#4a4d52] hover:border-[#a8956b] dark:hover:border-[#a8956b] transition-all p-5">
        {/* Image Container */}
        <figure className="relative overflow-hidden rounded-sm mb-4 aspect-16/10 bg-[#e5e4e0] dark:bg-[#35383c]">
          <img
            src={postService.getFileView(featuredImage)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </figure>

        {/* Content */}
        <div className="space-y-2">
          {/* Author and Date */}
          <div className="flex items-center gap-2 text-sm text-[#6a6e73] dark:text-[#9aa0a6]">
            <span className="font-normal">{authorName}</span>
            <span>•</span>
            <time>{formatDate($createdAt)}</time>
          </div>

          {/* Title */}
          <h2 className="text-lg font-normal text-[#1f2226] dark:text-[#e8e6e3] group-hover:text-[#a8956b] dark:group-hover:text-[#a8956b] transition-colors line-clamp-2">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-[#6a6e73] dark:text-[#9aa0a6] line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
