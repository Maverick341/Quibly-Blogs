import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { ChevronsUpDown, Share2, Trash2, RotateCcw, MoreVertical, Pencil, ArrowLeft } from "lucide-react";
import postService from "@/appwrite/post";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/Components";
import { removePost, setCurrentPost, editPost } from "@/store/postSlice";

export default function Post() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.currentPost);

  // const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      postService.getPost(slug).then((post) => {
        if (post) {
          dispatch(setCurrentPost({ post }));
          // setPost(post);
        } else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

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

  const moveToTrash = async () => {
    if (post.status === "active") {
      if (window.confirm("Are you sure you want to move this post to trash? You can restore it later.")) {
        try {
          const updatedPost = await postService.updatePost(post.$id, {
            title: post.title,
            content: post.content,
            featuredImage: post.featuredImage,
            status: "deleted",
            publishStatus: post.publishStatus,
          });
          if (updatedPost) {
            dispatch(editPost({ post: updatedPost }));
            dispatch(setCurrentPost({ post: updatedPost }));
          }
        } catch (error) {
          console.error("Error moving post to trash:", error);
        }
      }
    } else {
      try {
        const updatedPost = await postService.updatePost(post.$id, {
          title: post.title,
          content: post.content,
          featuredImage: post.featuredImage,
          status: "active",
          publishStatus: post.publishStatus,
        });
        if (updatedPost) {
          dispatch(editPost({ post: updatedPost }));
          dispatch(setCurrentPost({ post: updatedPost }));
        }
      } catch (error) {
        console.error("Error restoring post:", error);
      }
    }
  };

  // Format date and author
  const formattedDate = post?.$createdAt
    ? new Date(post.$createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const authorName = post?.authorName || "Anonymous";

  return post ? (
    <article className="min-h-screen bg-[#f5f3f0] dark:bg-[#2a2d31] pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-[720px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 my-4 sm:mb-6 px-2 sm:px-3 py-2 text-sm text-[#4f5358] dark:text-[#c5c3bf] hover:text-[#1f2226] dark:hover:text-[#e8e6e3] transition-colors cursor-pointer"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Featured Image first */}
        <figure className={`relative mb-6 sm:mb-10 rounded-lg sm:rounded-xl overflow-hidden shadow-auth-light dark:shadow-auth-dark bg-[#f7f5f2] dark:bg-[#26292d] border border-[#dcd8d0] dark:border-[#3f4347]`}>
          <img
            src={postService.getFileView(post.featuredImage)}
            alt={post.title}
            className={`w-full object-cover ${isExpanded ? "max-h-[1000px]" : "max-h-96"} transition-all duration-500 ease-in-out`}
          />
          <button
                type="button"
                onClick={() => 
                  setIsExpanded((prev) => !prev)
                }
                className="hidden sm:flex absolute top-4 right-4 w-9 h-9 items-center justify-center bg-white/70 dark:bg-black/50 rounded-lg hover:bg-white/90 dark:hover:bg-black/70 shadow-lg backdrop-blur-sm transition-all cursor-pointer z-10"
                title="Expand cover"
              >
                <ChevronsUpDown className="w-5 h-5 text-[#1f2226] dark:text-white" />
              </button>
        </figure>

        {/* Title and meta below image */}
        <header className="mb-4 sm:mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a] dark:text-[#f5f3f0] mb-3 sm:mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#666] dark:text-[#a8a8a8]">
            {formattedDate && <time className="italic">{formattedDate}</time>}
            <span className="text-[#a8956b]">•</span>
            <span>{authorName}</span>
          </div>
        </header>

        {/* Main content with reverse U curve (rounded top + border) and gradient shadow */}
        <div className="relative">
          {/* Gradient shadow layer */}
          <div
            className="absolute -inset-3 sm:-inset-6 -z-10"
            style={{
              background: `
                                linear-gradient(to top, rgba(0,0,0,0.12), transparent 60%),
                                linear-gradient(to left, rgba(0,0,0,0.08), transparent 60%),
                                linear-gradient(to right, rgba(0,0,0,0.08), transparent 60%)
                            `,
            }}
          />

          {/* Content container */}
          <div
            className="prose prose-sm sm:prose-base max-w-none
                        bg-[#f5f4f0] dark:bg-[#2a2d31]
                        text-[#2a2a2a] dark:text-[#e8e6e3]
                        border-l border-r border-t border-[#d0cdc8] dark:border-[#3a3d41]
                        rounded-t-lg
                        px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6
                        relative
                        min-h-[300px] sm:min-h-[400px]
                        prose-headings:font-serif prose-headings:text-[#1a1a1a] dark:prose-headings:text-[#f5f3f0] prose-headings:font-bold
                        prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-3 sm:prose-h2:mb-4
                        prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-2 sm:prose-h3:mb-3
                        prose-p:leading-6 sm:prose-p:leading-7 prose-p:mb-4 sm:prose-p:mb-6 prose-p:text-xs sm:prose-p:text-sm
                        prose-a:text-[#a8956b] prose-a:no-underline hover:prose-a:underline
                        prose-ul:my-4 sm:prose-ul:my-6 prose-ol:my-4 sm:prose-ol:my-6 prose-li:my-1 sm:prose-li:my-2 prose-li:leading-5 sm:prose-li:leading-6 prose-li:text-xs sm:prose-li:text-sm
                        prose-blockquote:border-l-4 prose-blockquote:border-[#a8956b] prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#4a4a4a] dark:prose-blockquote:text-[#b8b6b3] prose-blockquote:text-xs sm:prose-blockquote:text-sm
                        prose-img:rounded-lg prose-img:my-6 sm:prose-img:my-8
                        prose-strong:text-[#1a1a1a] dark:prose-strong:text-[#f5f3f0] prose-strong:font-semibold
                        prose-code:text-[#a8956b] prose-code:bg-[#e8e6e3] dark:prose-code:bg-[#3a3d41] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm"
          >
            {parse(post.content)}
          </div>
        </div>

        {/* Action Bar - Below Content */}
        <div className="flex justify-center mt-4 sm:mt-6">
          <div className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 sm:py-1 bg-white dark:bg-[#35383c] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[#e0dcd5] dark:border-[#414549]">
            {/* Share button - available to all */}
            <Button
              onClick={() => {
                const shareUrl = `${window.location.origin}/post/${slug}`;
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: shareUrl,
                  });
                } else {
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied to clipboard!");
                }
              }}
              className="p-1.5 sm:p-2 text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors duration-150 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="Share post"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
            </Button>

            {isAuthor && (
              <>
                <div className="w-px h-3 sm:h-4 bg-[#e0dcd5] dark:bg-[#414549]" />
                
                {/* Three-dot menu */}
                <div ref={menuRef} className="relative">
                  <Button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 sm:p-2 text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors duration-150 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    title="More actions"
                  >
                    <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>

                  {/* Dropdown Menu */}
                  {showMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-44 sm:w-48 bg-[#faf9f7] dark:bg-[#35383c] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-[#d8d4cc] dark:border-[#4a4d52] py-1.5 z-50 backdrop-blur-sm">
                      <Link to={`/edit-post/${post.$id}`}>
                        <button
                          onClick={() => setShowMenu(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-[#3a3a3a] dark:text-[#e0deda] hover:bg-[#f0ede8] dark:hover:bg-[#2f3236] transition-all duration-150 cursor-pointer font-medium first:rounded-t-xl"
                        >
                          <Pencil className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 text-[#8c7a57]" strokeWidth={2} />
                          <span className="text-left">Edit</span>
                        </button>
                      </Link>
                      <div className="h-px bg-[#e8e5df] dark:bg-[#414549] mx-2 my-1" />
                      <button
                        onClick={() => {
                          moveToTrash();
                          setShowMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 sm:py-2 text-sm sm:text-base hover:bg-[#f0ede8] dark:hover:bg-[#2f3236] transition-all duration-150 cursor-pointer font-medium last:rounded-b-xl ${
                          post.status === "active"
                            ? "text-[#c9302c] dark:text-[#ff6b6b]"
                            : "text-[#5cb85c] dark:text-[#51cf66]"
                        }`}
                      >
                        {post.status === "active" ? (
                          <>
                            <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" strokeWidth={2} />
                            <span className="text-left">Move to Trash</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" strokeWidth={2} />
                            <span className="text-left">Restore</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  ) : null;
}
