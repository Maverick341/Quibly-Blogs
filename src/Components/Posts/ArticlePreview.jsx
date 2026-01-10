import React from "react";
import { EditorOutput } from "..";

function ArticlePreview({ slug, title, subtitle, content, coverImage }) {
  function safeParse(value, fallback = { blocks: [] }) {
    try {
      if (typeof value === "string") return JSON.parse(value);
      return value || fallback;
    } catch (e) {
      console.warn("Failed to parse content, using fallback.", e);
      return fallback;
    }
  }

  const parsedContent = safeParse(content, { blocks: [] });

  return (
    <div className="min-h-screen bg-[#f5f3f0] dark:bg-[#2a2d31] pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Featured Image */}
        {coverImage && (
          <figure className="relative mt-6 sm:mt-8 mb-6 sm:mb-10 rounded-lg sm:rounded-xl overflow-hidden shadow-auth-light dark:shadow-auth-dark bg-[#f7f5f2] dark:bg-[#26292d] border border-[#dcd8d0] dark:border-[#3f4347]">
            <img
              src={coverImage}
              alt={title}
              className="w-full object-cover max-h-96 transition-all duration-500 ease-in-out"
            />
          </figure>
        )}

        <div className="relative">
          {/* Title and Subtitle */}
          <header className="mb-4 sm:mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a] dark:text-[#f5f3f0] mb-3 sm:mb-4 leading-tight wrap-break-word">
              {title || "Article Title"}
            </h1>

            {subtitle && (
              <p className="text-lg sm:text-xl md:text-2xl text-[#4f5358] dark:text-[#c5c3bf] leading-relaxed wrap-break-word">
                {subtitle}
              </p>
            )}
          </header>

          {/* Main content */}
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
              className="bg-[#f5f4f0] dark:bg-[#2a2d31]
                        text-[#2a2a2a] dark:text-[#e8e6e3]
                        border-l border-r border-t border-[#d0cdc8] dark:border-[#3a3d41]
                        rounded-t-lg
                        px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6
                        relative
                        min-h-[300px] sm:min-h-[400px]"
            >
              {parsedContent.blocks && parsedContent.blocks.length > 0 ? (
                <EditorOutput content={parsedContent} />
              ) : (
                <p className="text-[#999] italic">No content yet...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePreview;
