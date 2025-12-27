import React from "react";
// import { Controller } from "react-hook-form";
import { Editor } from ".";

export default function RTE({
  label,
  defaultValue,
  // name = "content",
  // control,
  editorRef,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-2 pl-1 text-sm font-medium text-neutral-mid dark:text-neutral-darkText">
          {label}
        </label>
      )}

      <Editor ref={editorRef} defaultValue={defaultValue} />

      {/* <Controller
        name={name}
        control={control}
        rules={{ required: "Content is required" }}
        render={() => <Editor ref={editorRef} />}
      /> */}
    </div>
  );
}
