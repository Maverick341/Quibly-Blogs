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
    <div className="w-full overflow-x-auto overflow-y-visible pb-20">
      <div className="min-w-[600px]">
        <table className="w-full bg-white dark:bg-[#35383c] border border-[#d4d3cf] dark:border-[#4a4d52]">
          <thead className="bg-[#f8f7f4] dark:bg-[#2a2d31] border border-[#d4d3cf] dark:border-[#4a4d52]">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#4f5358] dark:text-[#c5c3bf] uppercase tracking-wider">
                Title
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#4f5358] dark:text-[#c5c3bf] w-64 uppercase tracking-wider">
                Slug
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[#4f5358] dark:text-[#c5c3bf] w-32 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {posts.map((post, index) => (
              <UserPostCard key={post.$id} {...post} onDelete={onDelete} onRestore={onRestore} rowIndex={index} totalRows={posts.length} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserPostTable;
