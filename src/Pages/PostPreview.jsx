import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArticlePreview } from "@/Components";

function PostPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug: slugParam } = useParams();

  const state = location.state || {};
  const {slug, title, subtitle, content, coverImage } = state;

  // Redirect back if preview data is missing
  useEffect(() => {
    if (!slug && !title && !subtitle && !content) {
      const fallback = slugParam ? `/edit-post/${slugParam}` : "/add-post";
      navigate(fallback, { replace: true });
    }
  }, [navigate, slugParam, slug, title, subtitle, content]);

  if (!slug && !title && !subtitle && !content) return null;

  return (
    <ArticlePreview
      slug={slug}
      title={title}
      subtitle={subtitle}
      content={content || { blocks: [] }}
      coverImage={coverImage}
    />
  );
}

export default PostPreview;
