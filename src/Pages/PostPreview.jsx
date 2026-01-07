import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArticlePreview } from "@/Components";

function PostPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const state = location.state || {};
  const { title, subtitle, content, coverImage } = state;

  // Redirect back if preview data is missing
  useEffect(() => {
    if (!title && !subtitle && !content) {
      const fallback = slug ? `/edit-post/${slug}` : "/add-post";
      navigate(fallback, { replace: true });
    }
  }, [navigate, slug, title, subtitle, content]);

  if (!title && !subtitle && !content) return null;

  return (
    <ArticlePreview
      title={title}
      subtitle={subtitle}
      content={content || { blocks: [] }}
      coverImage={coverImage}
    />
  );
}

export default PostPreview;
