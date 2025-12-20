import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import postService from "@/appwrite/post";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPost, editPost } from "@/store/postSlice";
import { X, ChevronDown, Trash2, ArrowLeft } from "lucide-react";

function PostForm({ post }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [removeExistingCover, setRemoveExistingCover] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(Boolean(post?.subtitle));
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleErrors, setVisibleErrors] = useState({});
  const [submitAttempt, setSubmitAttempt] = useState(0);
  const subtitleInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        subtitle: post?.subtitle || "",
        slug: post?.$id || "",
        content: post?.content || "",
        publishStatus: post?.publishStatus || "published",
        status: post?.status || "active",
        subtitle: post?.subtitle || "",
      },
    });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const userData = useSelector((state) => state.auth.userData);

  const handlePreview = () => {
    if (editorRef.current) {
      editorRef.current.execCommand("mcePreview");
    }
  };

  // Handle image preview for new posts
  const imageInput = watch("image");
  useEffect(() => {
    if (imageInput && imageInput[0]) {
      const file = imageInput[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [imageInput]);

  // Focus subtitle when revealed
  useEffect(() => {
    if (showSubtitle && subtitleInputRef.current) {
      subtitleInputRef.current.focus();
    }
  }, [showSubtitle]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Auto-hide errors after 5 seconds
  useEffect(() => {
    if (submitAttempt > 0) {
      const newVisibleErrors = {};
      Object.keys(errors).forEach(key => {
        newVisibleErrors[key] = true;
      });
      setVisibleErrors(newVisibleErrors);

      if (Object.keys(errors).length > 0) {
        const timer = setTimeout(() => {
          setVisibleErrors({});
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [errors, submitAttempt]);

  const submit = async (data) => {
    // Show confirmation alert before publishing/updating
    const action = post ? "update" : "publish";
    const message = post 
      ? "Are you sure you want to update this post?" 
      : "Are you sure you want to publish this post?";
    
    if (!window.confirm(message)) {
      return;
    }

    if (post) {
      const file = data.image[0]
        ? await postService.uploadFile(data.image[0])
        : null;

      if (file) {
        await postService.deleteFile(post.featuredImage);
      }
      const dbPost = await postService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });

      if (dbPost) {
        dispatch(editPost({ post: dbPost }))
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = data.image[0]
        ? await postService.uploadFile(data.image[0])
        : null;

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        
        if (!userData) {
          console.error("User data not available");
          return;
        }

        const newDbPost = await postService.createPost({
          ...data,
          userId: userData.$id,
          authorName: userData.name,
        });

        if (newDbPost) {
          dispatch(addPost({ post: newDbPost }));
          navigate(`/post/${newDbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 36);

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  const hasCover = Boolean(((post && post.featuredImage && !removeExistingCover)) || previewImage);

  return (
    <form onSubmit={(e) => {
      setSubmitAttempt(prev => prev + 1);
      handleSubmit(submit)(e);
    }} className="min-h-screen bg-[#f5f4f0] dark:bg-[#2a2d31] text-[#1f2226] dark:text-[#e8e6e3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Buttons and Slug - Simple layout without navbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-1.5 sm:gap-1">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center p-1.5 sm:p-1 text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </Button>
            <Button
              type="button"
              className="inline-block px-2.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors cursor-pointer duration-150 ease-out rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              type="submit"
              className="px-2.5 sm:px-2 py-1.5 sm:py-2 bg-[#a8956b] hover:bg-[#8f7d5a] text-white text-xs sm:text-sm font-medium rounded transition-colors cursor-pointer"
            >
              {post ? "Update" : "Publish"}
            </Button>
            {/* Dropdown Menu - Only when editing */}
            {post && (
              <div ref={dropdownRef} className="relative">
                <Button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 px-2 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>

                {/* Dropdown Content */}
                {showDropdown && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-auto bg-[#faf9f7] dark:bg-[#35383c] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] z-50 border border-[#d8d4cc] dark:border-[#4a4d52] backdrop-blur-sm">
                    <div className="px-2.5 py-2 sm:px-2 sm:py-2.5">
                      {/* Horizontal Layout: Toggle and Trash side by side - always */}
                      <div className="flex items-center gap-2">
                        {/* Move to Trash/Restore Button - icon only on all sizes */}
                        {watch("status") === "active" ? (
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to move this post to trash? You can restore it later.")) {
                                try {
                                  const updatedPost = await postService.updatePost(post.$id, {
                                    title: watch("title"),
                                    content: watch("content"),
                                    featuredImage: post.featuredImage,
                                    status: "deleted",
                                    publishStatus: watch("publishStatus"),
                                  });
                                  if (updatedPost) {
                                    setValue("status", "deleted");
                                    dispatch(editPost({ post: updatedPost }));
                                    setShowDropdown(false);
                                  }
                                } catch (error) {
                                  console.error("Error moving post to trash:", error);
                                }
                              }
                            }}
                            className="flex items-center justify-center p-2 sm:p-2.5 text-[#c9302c] dark:text-[#ff6b6b] hover:bg-[#f0ede8] dark:hover:bg-[#2f3236] rounded-lg transition-all duration-150 cursor-pointer"
                            title="Move to Trash"
                          >
                            <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" strokeWidth={2} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const updatedPost = await postService.updatePost(post.$id, {
                                  title: watch("title"),
                                  content: watch("content"),
                                  featuredImage: post.featuredImage,
                                  status: "active",
                                  publishStatus: watch("publishStatus"),
                                });
                                if (updatedPost) {
                                  setValue("status", "active");
                                  dispatch(editPost({ post: updatedPost }));
                                  setShowDropdown(false);
                                }
                              } catch (error) {
                                console.error("Error restoring post:", error);
                              }
                            }}
                            className="flex items-center justify-center p-2 sm:p-2.5 text-[#5cb85c] dark:text-[#51cf66] hover:bg-[#f0ede8] dark:hover:bg-[#2f3236] rounded-lg transition-all duration-150 cursor-pointer"
                            title="Restore Post"
                          >
                            <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        )}

                        {/* Divider */}
                        <div className="w-px h-6 sm:h-7 bg-[#e8e5df] dark:bg-[#414549]" />

                        {/* Publish Status Toggle */}
                        <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#f0ede8] dark:bg-[#2f3236] rounded-lg">
                          <span className="text-[10px] sm:text-xs font-medium text-[#3a3a3a] dark:text-[#e0deda] whitespace-nowrap">
                            {watch("publishStatus") === "published" ? "Published" : "Draft"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setValue("publishStatus", watch("publishStatus") === "published" ? "draft" : "published")}
                            className={`relative inline-flex h-4 w-8 sm:h-5 sm:w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                              watch("publishStatus") === "published" 
                                ? "bg-[#a8956b]" 
                                : "bg-[#d0cdc7] dark:bg-[#5a5d61]"
                            }`}
                            title={watch("publishStatus") === "published" ? "Switch to Draft" : "Switch to Published"}
                          >
                            <span
                              className={`inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                                watch("publishStatus") === "published" ? "translate-x-4 sm:translate-x-4.5" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slug in top right */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-xs sm:text-sm font-mono text-[#4f5358] dark:text-[#c5c3bf] opacity-60 truncate max-w-[120px] sm:max-w-none">
              /{watch("slug") || "your-slug"}
            </div>
          </div>
        </div>
        {/* Actions: Add Cover + Add Subtitle */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6 min-h-10">
          {!hasCover && (
            <div className="relative">
              <button
                type="button"
                onClick={() => document.getElementById("featured-image-input").click()}
                className="flex items-center gap-2 text-[#4f5358] dark:text-[#c5c3bf] hover:text-[#8c7a57] dark:hover:text-[#a8956b] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                  <circle cx="8" cy="9" r="2" />
                  <path d="M21 19l-6-6-4 4-2-2-5 4" />
                </svg>
                <span className="text-xs sm:text-sm">Add Cover</span>
              </button>
              {errors.image && visibleErrors.image && (
                <p className="text-[10px] text-red-500 dark:text-red-400 absolute left-0 top-full mt-1 whitespace-nowrap">
                  {errors.image.message}
                </p>
              )}
            </div>
          )}
          {!showSubtitle && (
            <button
              type="button"
              onClick={() => setShowSubtitle(true)}
              className="flex items-center gap-2 text-[#4f5358] dark:text-[#c5c3bf] hover:text-[#8c7a57] dark:hover:text-[#a8956b] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs sm:text-sm">Add Subtitle</span>
            </button>
          )}
        </div>
        {/* Add Cover Section */}
        <div className="mb-6 sm:mb-8">
          {(((post && post.featuredImage) && !removeExistingCover) || previewImage) ? (
            <div className="relative mb-4 sm:mb-6">
              <img
                src={(post && post.featuredImage && !removeExistingCover) ? postService.getFileView(post.featuredImage) : previewImage}
                alt={post?.title || "Preview"}
                className="w-full rounded-lg max-h-64 sm:max-h-96 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setRemoveExistingCover(true);
                  const input = document.getElementById("featured-image-input");
                  if (input) input.value = '';
                }}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white/70 dark:bg-black/50 rounded-lg hover:bg-white/90 dark:hover:bg-black/70 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
                title="Remove cover"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f2226] dark:text-white" />
              </button>
            </div>
          ) : null}
          <Input
            id="featured-image-input"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            className="hidden"
            {...register("image", { required: !post ? "Cover image is required" : false })}
          />
        </div>

        

        {/* Title Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Article Title..."
            className="w-full text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-[#1a1a1a] dark:text-[#f5f3f0] bg-transparent border-none focus:outline-none placeholder:text-[#c5c3bf] dark:placeholder:text-[#666] wrap-break-word"
            {...register("title", { required: "Title is required" })}
          />
          <div className="h-4 mt-1">
            {errors.title && visibleErrors.title && (
              <p className="text-[10px] text-red-500 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* Subtitle Input (optional) */}
        {showSubtitle && (
          <div className="mb-6 sm:mb-8 relative">
            <input
              ref={subtitleInputRef}
              type="text"
              placeholder="Article Subtitle..."
              className="w-full text-lg sm:text-xl md:text-2xl text-[#4f5358] dark:text-[#c5c3bf] bg-transparent border-none focus:outline-none placeholder:text-[#c5c3bf] dark:placeholder:text-[#666]"
              {...register("subtitle")}
            />
            <button
              type="button"
              onClick={() => {
                setValue("subtitle", "", { shouldDirty: true, shouldValidate: true });
                setShowSubtitle(false);
              }}
              aria-label="Remove subtitle"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-[#8c7a57] dark:text-[#666] dark:hover:text-[#a8956b]"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Content Editor */}
        <div className="mb-6 sm:mb-8">
          <RTE
            label=""
            name="content"
            control={control}
            editorRef={editorRef}
            defaultValue={getValues("content")}
          />
          <div className="h-4 mt-1 sm:mt-2">
            {errors.content && visibleErrors.content && (
              <p className="text-[10px] text-red-500 dark:text-red-400">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Slug (Hidden) and Status for new posts */}
        <div className="hidden">
          <Input
            label="Slug"
            placeholder="Slug"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
          {!post && (
            <>
              <Input
                type="hidden"
                {...register("publishStatus")}
              />
              <Input
                type="hidden"
                {...register("status")}
              />
            </>
          )}
        </div>
      </div>
    </form>
  );
}

export default PostForm;
