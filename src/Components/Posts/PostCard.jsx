import React, { useEffect, useState } from "react";
import postService from "@/appwrite/post";
import profileService from "@/appwrite/profile";
import { Link } from "react-router-dom";

function PostCard({ $id, slug, title, subtitle, userId, featuredImage, $createdAt }) {
  const [authorName, setAuthorName] = useState("Anonymous");
  console.log(userId);  

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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get image URL
  const imageUrl = featuredImage 
    ? postService.getFilePreview(featuredImage)
    : null;

  return (
    <Link to={`/post/${slug}-${$id}`}>
      <article className="group bg-white/40 dark:bg-[#1a1c1e]/40 hover:bg-[#f3f1eb] dark:hover:bg-[#2f3236] border border-gray-200/50 dark:border-gray-700/50 hover:border-[#a8956b] dark:hover:border-[#a8956b] transition-all p-6 rounded-xl">
        <div className="flex gap-6 items-start">
          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* Author and Date */}
            <div className="flex items-center gap-2 text-sm text-[#6a6e73] dark:text-[#9aa0a6]">
              <span className="font-normal">{authorName}</span>
              <span>•</span>
              <time>{formatDate($createdAt)}</time>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#1f2226] dark:text-[#e8e6e3] group-hover:text-[#a8956b] dark:group-hover:text-[#a8956b] transition-colors line-clamp-2">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-base text-[#6a6e73] dark:text-[#9aa0a6] line-clamp-3">
                {subtitle}
              </p>
            )}

            {/* Read More */}
            <div className="pt-2">
              <span className="text-sm text-[#a8956b] cursor-pointer inline-flex items-center gap-1">
                <span className="group-hover:underline">Read more</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {imageUrl && (
            <div className="shrink-0 w-56 h-36 overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
