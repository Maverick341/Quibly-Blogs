import React, { useState } from "react";

function CustomCodeRenderer({ data, className = "" }) {
  const [copied, setCopied] = useState(false);

  if (!data?.code) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={`relative group ${className}`.trim()}>
      <pre className="bg-gray-200 dark:bg-gray-900 rounded-md p-4 pr-12 overflow-auto">
        <code className="text-gray-900 dark:text-gray-100 text-sm">{data.code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
          copied ? "cursor-default" : "cursor-pointer hover:cursor-pointer"
        }`}
        title={copied ? "Copied!" : "Copy code"}
        aria-label="Copy code to clipboard"
        disabled={copied}
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.25 8.5H10.25C9.2835 8.5 8.5 9.2835 8.5 10.25V17.25C8.5 18.2165 9.2835 19 10.25 19H17.25C18.2165 19 19 18.2165 19 17.25V10.25C19 9.2835 18.2165 8.5 17.25 8.5Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.5 8.5V6.75C15.5 6.28587 15.3156 5.84075 14.9874 5.51256C14.6592 5.18437 14.2141 5 13.75 5H6.75C6.28587 5 5.84075 5.18437 5.51256 5.51256C5.18437 5.84075 5 6.28587 5 6.75V13.75C5 14.2141 5.18437 14.6592 5.51256 14.9874C5.84075 15.3156 6.28587 15.5 6.75 15.5H8.5"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 12L15.5 12"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15.5L15.5 15.5"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default CustomCodeRenderer;