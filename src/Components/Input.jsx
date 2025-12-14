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
          className="block text-[11px] font-sans text-[#6b6f75] dark:text-[#b3b1ad] mb-1.5"
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        ref={ref}
        className={`w-full px-3 py-1.5 text-sm rounded-md font-sans focus:outline-none focus:ring-1 focus:ring-[#a8956b] transition-colors duration-150 ease-out 
        bg-[#f0eeea] text-[#1f2226] placeholder-[#7a7f86] border border-[#d5d2cc] dark:bg-[#35383c] dark:text-[#e8e6e3] dark:placeholder-[#b3b1ad] dark:border-transparent ${className}`}
        {...props}
      />

      {errors && (
        <p className="mt-1 text-xs text-[#a04c4c] dark:text-[#c77d7d] font-sans">
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
