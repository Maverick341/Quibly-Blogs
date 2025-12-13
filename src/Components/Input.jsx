import React, { useId } from "react";

function Input(
  { label, type = "text", className = "", errors, ...props },
  ref
) {
  const id = useId();
  return (
    <div>
      {label && (
        <label
          className="block text-xs font-sans text-[#c5c3bf] mb-1.5"
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        ref={ref}
        className={`w-full px-3 py-2 text-sm bg-[#35383c] rounded-md text-[#e8e6e3] font-sans focus:outline-none focus:ring-1 focus:ring-[#a8956b] transition-colors ${className}`}
        {...props}
      />

      {errors && (
        <p className="mt-1 text-xs text-[#c77d7d] font-sans">
          {errors.message}
        </p>
      )}
    </div>
  );
}

export default React.forwardRef(Input);

// In React 19, forwardRef is no longer necessary. Pass ref as a prop instead.

// function Input({
//     label,
//     type = "text",
//     className = "",
//     ref,
//     ...props
// }) {
//   return <input type={type} ref={ref} {...props} />;
// }
