import React from "react";
import UserPostCard from "./UserPostCard";

function UserPostTable({ posts, onDelete, onRestore }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-[#4f5358] dark:text-[#c5c3bf] mb-6">
          You haven't written any posts yet.
        </p>
        <p className="text-[#6a6e73] dark:text-[#9aa0a6] mb-8">
          Start your first story today.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#35383c] rounded-lg border border-[#e5e4e0] dark:border-[#4a4d52]">
      <table className="w-full">
        <thead className="bg-[#f8f7f4] dark:bg-[#2a2d31] border-b border-[#e5e4e0] dark:border-[#3a3d41]">
          <tr>
            <th className="text-left py-2 px-4 text-xs font-semibold text-[#4f5358] dark:text-[#c5c3bf]">
              Title
            </th>
            <th className="hidden md:table-cell text-left py-2 px-4 text-xs font-semibold text-[#4f5358] dark:text-[#c5c3bf] w-64">
              Slug
            </th>
            <th className="text-right py-2 px-4 text-xs font-semibold text-[#4f5358] dark:text-[#c5c3bf] w-32">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <UserPostCard key={post.$id} {...post} onDelete={onDelete} onRestore={onRestore} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserPostTable;
