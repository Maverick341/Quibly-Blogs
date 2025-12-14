import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "@/appwrite/post";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container } from "@/Components";
import { removePost, setCurrentPost } from "@/store/postSlice";

export default function Post() {
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
                }
                else navigate("/");
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
                <figure className="relative mb-8 sm:mb-10 rounded-xl overflow-hidden shadow-auth-light dark:shadow-auth-dark bg-[#f7f5f2] dark:bg-[#26292d] border border-[#dcd8d0] dark:border-[#3f4347]">
                    <img
                        src={postService.getFileView(post.featuredImage)}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                    />
                    {isAuthor && (
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <button className="px-3 py-1.5 bg-[#a8956b] hover:bg-[#8f7d5a] text-white text-xs font-medium rounded transition-colors">
                                    Edit
                                </button>
                            </Link>
                            <button
                                onClick={deletePost}
                                className="px-3 py-1.5 bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs font-medium rounded transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </figure>

                {/* Title and meta below image */}
                <header className="mb-6">
                    <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1a1a1a] dark:text-[#f5f3f0] mb-4 leading-tight">
                        {post.title}
                    </h1>
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
                            `
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
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>
        </article>
    ) : null;
}