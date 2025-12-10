import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Oops! Something went wrong
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-red-800 mb-2">Error Details:</p>
          <pre className="text-sm text-red-700 whitespace-pre-wrap wrap-break-word">
            {error.message}
          </pre>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function ErrorBoundary({ children }) {
  const handleReset = () => {
    // Reset any global state if needed
    window.location.href = "/";
  };

  return (
    <ReactErrorBoundary FallbackComponent={Fallback} onReset={handleReset}>
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
