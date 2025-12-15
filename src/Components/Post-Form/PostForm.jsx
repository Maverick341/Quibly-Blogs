import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import postService from "@/appwrite/post";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPost, editPost } from "@/store/postSlice";

function PostForm({ post }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [removeExistingCover, setRemoveExistingCover] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(Boolean(post?.subtitle));
  const subtitleInputRef = useRef(null);
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
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

  const submit = async (data) => {
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
        .replace(/\s/g, "-");

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
    <form onSubmit={handleSubmit(submit)} className="min-h-screen bg-[#f5f4f0] dark:bg-[#2a2d31] text-[#1f2226] dark:text-[#e8e6e3]">
      <div className="max-w-4xl mx-auto p-8">
        {/* Buttons and Slug - Simple layout without navbar */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="inline-block px-4 py-2 text-sm text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors cursor-pointer duration-150 ease-out rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-[#a8956b] hover:bg-[#8f7d5a] text-white text-sm font-medium rounded transition-colors cursor-pointer"
            >
              {post ? "Update" : "Publish"}
            </Button>
          </div>

          {/* Slug in top right */}
          <div className="text-sm font-mono text-[#4f5358] dark:text-[#c5c3bf] opacity-60">
            /{watch("slug") || "your-slug"}
          </div>
        </div>
        {/* Actions: Add Cover + Add Subtitle */}
        <div className="flex items-center gap-6 mb-6">
          {!hasCover && (
            <button
              type="button"
              onClick={() => document.getElementById("featured-image-input").click()}
              className="flex items-center gap-2 text-[#4f5358] dark:text-[#c5c3bf] hover:text-[#8c7a57] dark:hover:text-[#a8956b] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                <circle cx="8" cy="9" r="2" />
                <path d="M21 19l-6-6-4 4-2-2-5 4" />
              </svg>
              <span className="text-sm">Add Cover</span>
            </button>
          )}
          {!showSubtitle && (
            <button
              type="button"
              onClick={() => setShowSubtitle(true)}
              className="flex items-center gap-2 text-[#4f5358] dark:text-[#c5c3bf] hover:text-[#8c7a57] dark:hover:text-[#a8956b] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">Add Subtitle</span>
            </button>
          )}
        </div>
        {/* Add Cover Section */}
        <div className="mb-8">
          {(((post && post.featuredImage) && !removeExistingCover) || previewImage) ? (
            <div className="relative mb-6">
              <img
                src={(post && post.featuredImage && !removeExistingCover) ? postService.getFileView(post.featuredImage) : previewImage}
                alt={post?.title || "Preview"}
                className="w-full rounded-lg max-h-96 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setRemoveExistingCover(true);
                  const input = document.getElementById("featured-image-input");
                  if (input) input.value = '';
                }}
                className="absolute top-4 right-4 p-2 bg-white dark:bg-[#35383c] rounded-lg hover:bg-gray-100 dark:hover:bg-[#3f4347] shadow-lg"
                title="Remove cover"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : null}
          <input
            id="featured-image-input"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            className="hidden"
            {...register("image", { required: !post })}
          />
        </div>

        

        {/* Title Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Article Title..."
            className="w-full text-5xl font-bold text-[#1a1a1a] dark:text-[#f5f3f0] bg-transparent border-none focus:outline-none placeholder:text-[#c5c3bf] dark:placeholder:text-[#666]"
            {...register("title", { required: true })}
          />
        </div>

        {/* Subtitle Input (optional) */}
        {showSubtitle && (
          <div className="mb-8 relative">
            <input
              ref={subtitleInputRef}
              type="text"
              placeholder="Article Subtitle..."
              className="w-full text-2xl text-[#4f5358] dark:text-[#c5c3bf] bg-transparent border-none focus:outline-none placeholder:text-[#c5c3bf] dark:placeholder:text-[#666]"
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content Editor */}
        <div className="mb-8">
          <RTE
            label=""
            name="content"
            control={control}
            editorRef={editorRef}
            defaultValue={getValues("content")}
          />
        </div>

        {/* Status and Slug (Hidden) */}
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
          <Select
            options={["active", "inactive"]}
            label="Status"
            {...register("status", { required: true })}
          />
        </div>
      </div>
    </form>
  );
}

export default PostForm;
