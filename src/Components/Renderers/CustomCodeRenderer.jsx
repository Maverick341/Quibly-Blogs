import React from "react";

function CustomCodeRenderer({ data, className = "" }) {
  if (!data?.code) return null;

  return (
    <pre className={`bg-gray-800 rounded-md p-4 overflow-auto ${className}`.trim()}>
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

export default CustomCodeRenderer;