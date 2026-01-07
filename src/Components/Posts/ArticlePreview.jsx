import React from "react";
import { EditorOutput } from "..";

function ArticlePreview({ title, subtitle, content, coverImage }) {
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
      <div className="max-w-[720px] mx-auto">
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
