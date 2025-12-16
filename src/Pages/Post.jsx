import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { ChevronsUpDown, Share2 } from "lucide-react";
import postService from "@/appwrite/post";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/Components";
import { removePost, setCurrentPost } from "@/store/postSlice";

export default function Post() {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const deletePost = () => {
    postService.deletePost(post.$id).then((status) => {
      if (status) {
        dispatch(removePost(post.$id));
        postService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  // Format date and author
  const formattedDate = post?.$createdAt
    ? new Date(post.$createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const authorName = isAuthor && userData?.name ? userData.name : post?.userId;

  return post ? (
    <article className="min-h-screen bg-[#f5f3f0] dark:bg-[#2a2d31] py-12 px-4 sm:px-6">
      <div className="max-w-[720px] mx-auto">
        {/* Featured Image first */}
        <figure className={`relative sm:mb-10 rounded-xl overflow-hidden shadow-auth-light dark:shadow-auth-dark bg-[#f7f5f2] dark:bg-[#26292d] border border-[#dcd8d0] dark:border-[#3f4347]`}>
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
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/70 dark:bg-black/50 rounded-lg hover:bg-white/90 dark:hover:bg-black/70 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
                title="Expand cover"
              >
                <ChevronsUpDown className="w-5 h-5 text-[#1f2226] dark:text-white" />
              </button>
        </figure>

        {/* Title and meta below image */}
        <header className="mb-6">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1a1a1a] dark:text-[#f5f3f0] mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Edit/Delete buttons for authors */}

          <div className="flex justify-end mb-7">
            <div className="inline-flex items-center gap-0.5 px-2 py-1 bg-white dark:bg-[#35383c] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#e0dcd5] dark:border-[#414549]">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors duration-150 rounded hover:bg-black/5 dark:hover:bg-white/5"
                title="Share post"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Share</span>
              </Button>

              {isAuthor && (
                <>
                  <div className="w-px h-4 bg-[#e0dcd5] dark:bg-[#414549]" />
                  
                  <Link to={`/edit-post/${post.$id}`}>
                    <Button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors duration-150 rounded hover:bg-black/5 dark:hover:bg-white/5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit</span>
                    </Button>
                  </Link>

                  <Button
                    onClick={deletePost}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4f5358] hover:text-[#d9534f] dark:text-[#c5c3bf] dark:hover:text-[#ef4444] transition-colors duration-150 rounded hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Delete</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#666] dark:text-[#a8a8a8]">
            {formattedDate && <time className="italic">{formattedDate}</time>}
            <span className="text-[#a8956b]">•</span>
            <span>{authorName}</span>
          </div>
        </header>

        {/* Main content with reverse U curve (rounded top + border) and gradient shadow */}
        <div className="relative">
          {/* Gradient shadow layer */}
          <div
            className="absolute -inset-6 -z-10"
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
            className="prose prose-lg max-w-none
                        bg-[#f5f4f0] dark:bg-[#2a2d31]
                        text-[#2a2a2a] dark:text-[#e8e6e3]
                        border-l border-r border-t border-[#d0cdc8] dark:border-[#3a3d41]
                        rounded-t-lg
                        px-8 py-6
                        relative
                        prose-headings:font-serif prose-headings:text-[#1a1a1a] dark:prose-headings:text-[#f5f3f0] prose-headings:font-bold
                        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                        prose-p:leading-8 prose-p:mb-6 prose-p:text-lg
                        prose-a:text-[#a8956b] prose-a:no-underline hover:prose-a:underline
                        prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-li:leading-7
                        prose-blockquote:border-l-4 prose-blockquote:border-[#a8956b] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#4a4a4a] dark:prose-blockquote:text-[#b8b6b3]
                        prose-img:rounded-lg prose-img:my-8
                        prose-strong:text-[#1a1a1a] dark:prose-strong:text-[#f5f3f0] prose-strong:font-semibold
                        prose-code:text-[#a8956b] prose-code:bg-[#e8e6e3] dark:prose-code:bg-[#3a3d41] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
          >
            {parse(post.content)}
          </div>
        </div>
      </div>
    </article>
  ) : null;
}
