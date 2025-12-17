import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Eye, MoreVertical, RotateCcw } from "lucide-react";

function UserPostCard({ $id, title, slug, status, publishStatus, $createdAt, onDelete, onRestore, rowIndex = 0, totalRows = 1 }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <tr className="border border-[#d4d3cf] dark:border-[#4a4d52] hover:outline hover:outline-[#a8956b] dark:hover:outline-[#a8956b] hover:-outline-offset-1 transition-all relative" style={{ zIndex: showMenu ? 10 : 1 }}>
      {/* Title Column */}
      <td className="py-4 px-4">
        <Link
          to={`/post/${$id}`}
          className="text-base font-medium text-[#1f2226] dark:text-[#e8e6e3] hover:text-[#a8956b] dark:hover:text-[#a8956b] transition-colors line-clamp-1 block"
        >
          {title}
        </Link>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-[#6a6e73] dark:text-[#9aa0a6]">
            {formatDate($createdAt)}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                publishStatus === "published"
                  ? "bg-green-500"
                  : "bg-yellow-500 dark:bg-yellow-600"
              }`}
            />
            <span className="text-xs text-[#6a6e73] dark:text-[#9aa0a6]">
              {publishStatus === "published" ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      </td>

      {/* Slug Column */}
      <td className="py-4 px-4 w-64">
        <span className="text-xs font-mono text-[#6a6e73] dark:text-[#9aa0a6] truncate block">
          /{slug || $id}
        </span>
      </td>

      {/* Actions Column */}
      <td className="py-4 px-4 relative w-32">
        <div className="flex items-center justify-end gap-1">
          
          <button
            onClick={() => status !== "deleted" && navigate(`/edit-post/${$id}`)}
            disabled={status === "deleted"}
            className={`p-1.5 rounded-md transition-colors ${
              status === "deleted"
                ? "text-[#9aa0a6] dark:text-[#6a6e73] cursor-not-allowed opacity-50"
                : "text-[#6a6e73] dark:text-[#9aa0a6] hover:text-[#a8956b] dark:hover:text-[#a8956b] hover:bg-[#f0eeea] dark:hover:bg-[#2a2d31] cursor-pointer"
            }`}
            title={status === "deleted" ? "Cannot edit deleted post" : "Edit post"}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          
          {/* Restore button - only for deleted posts */}
          {status === "deleted" && (
            <button
              onClick={async () => {
                setIsRestoring(true);
                await onRestore($id);
                setIsRestoring(false);
              }}
              disabled={isRestoring}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isRestoring
                  ? "text-[#9aa0a6] dark:text-[#6a6e73] cursor-not-allowed opacity-50"
                  : "text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 hover:bg-[#f0eeea] dark:hover:bg-[#2a2d31]"
              }`}
              title="Restore post"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          
          {/* Three-dot menu */}
          <div ref={menuRef} className="relative">
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-[#6a6e73] dark:text-[#9aa0a6] hover:text-[#4f5358] dark:hover:text-[#c5c3bf] hover:bg-[#f0eeea] dark:hover:bg-[#2a2d31] rounded-md transition-colors cursor-pointer"
              title="More actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#35383c] rounded-lg shadow-xl border border-[#e5e4e0] dark:border-[#4a4d52] py-1 z-100">
                <button
                  onClick={() => {
                    navigate(`/post/${$id}`);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#4f5358] dark:text-[#c5c3bf] hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31] transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View post</span>
                </button>
                <button
                  onClick={() => {
                    onDelete($id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-[#f8f7f4] dark:hover:bg-[#2a2d31] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Permanently</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default UserPostCard;