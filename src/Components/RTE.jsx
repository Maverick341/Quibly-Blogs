import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";

export default function RTE({
  label,
  name,
  control,
  editorRef,
  defaultValue = "",
}) {
  const isDark = useSelector((state) => state.theme.mode === "dark");

  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <div className={`rounded-lg overflow-hidden border ${
        isDark 
          ? 'bg-[#35383c] border-[#4a4d52]' 
          : 'bg-[#f8f7f4] border-[#e5e4e0]'
      }`}>
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            key={isDark ? 'dark' : 'light'}
            tinymceScriptSrc="/node_modules/tinymce/tinymce.min.js"
            licenseKey="gpl"
            apiKey="2yuwar8xgmih8cez9oi06kcwvx3sk20hx3z8af2ovt8u0da6"
            onInit={(evt, editor) => {
              editorRef.current = editor; 
            }}
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              height: 500,
              menubar: true,
              skin: isDark ? 'oxide-dark' : 'oxide',
              content_css: isDark ? 'dark' : 'default',
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style: isDark
                ? `
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    font-size: 18px;
                    line-height: 1.8;
                    background-color: #35383c;
                    color: #e8e6e3;
                    padding: 1rem;
                  }
                  h1 {
                    font-size: 2.5em;
                    font-weight: 700;
                    color: #f5f3f0;
                    margin: 1.5em 0 0.5em;
                    line-height: 1.2;
                  }
                  h2 {
                    font-size: 2em;
                    font-weight: 700;
                    color: #f5f3f0;
                    margin: 1.3em 0 0.5em;
                    line-height: 1.3;
                  }
                  h3 {
                    font-size: 1.5em;
                    font-weight: 600;
                    color: #f5f3f0;
                    margin: 1.2em 0 0.5em;
                  }
                  h4, h5, h6 {
                    font-weight: 600;
                    color: #f5f3f0;
                    margin: 1em 0 0.5em;
                  }
                  p {
                    margin: 0 0 1.2em;
                  }
                  a {
                    color: #a8956b;
                    text-decoration: underline;
                    transition: color 0.2s;
                  }
                  a:hover {
                    color: #c5ae83;
                  }
                  strong {
                    font-weight: 700;
                    color: #f5f3f0;
                  }
                  em {
                    font-style: italic;
                  }
                  code {
                    background-color: #35383c;
                    color: #a8956b;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Courier New', monospace;
                    font-size: 0.9em;
                  }
                  pre {
                    background-color: #35383c;
                    color: #e8e6e3;
                    padding: 1rem;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1.5em 0;
                  }
                  pre code {
                    background-color: transparent;
                    padding: 0;
                  }
                  blockquote {
                    border-left: 4px solid #a8956b;
                    padding-left: 1.5rem;
                    margin: 1.5em 0;
                    color: #c5c3bf;
                    font-style: italic;
                  }
                  ul, ol {
                    margin: 1em 0;
                    padding-left: 2em;
                  }
                  li {
                    margin: 0.5em 0;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1.5em 0;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1.5em 0;
                  }
                  table th,
                  table td {
                    border: 1px solid #4f5358;
                    padding: 0.75rem;
                    text-align: left;
                  }
                  table th {
                    background-color: #35383c;
                    font-weight: 600;
                    color: #f5f3f0;
                  }
                  hr {
                    border: none;
                    border-top: 2px solid #4f5358;
                    margin: 2em 0;
                  }
                `
                : `
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    font-size: 18px;
                    line-height: 1.8;
                    background-color: #f8f7f4;
                    color: #1f2226;
                    padding: 1rem;
                  }
                  h1 {
                    font-size: 2.5em;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 1.5em 0 0.5em;
                    line-height: 1.2;
                  }
                  h2 {
                    font-size: 2em;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 1.3em 0 0.5em;
                    line-height: 1.3;
                  }
                  h3 {
                    font-size: 1.5em;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin: 1.2em 0 0.5em;
                  }
                  h4, h5, h6 {
                    font-weight: 600;
                    color: #1a1a1a;
                    margin: 1em 0 0.5em;
                  }
                  p {
                    margin: 0 0 1.2em;
                  }
                  a {
                    color: #a8956b;
                    text-decoration: underline;
                    transition: color 0.2s;
                  }
                  a:hover {
                    color: #8f7d5a;
                  }
                  strong {
                    font-weight: 700;
                    color: #1a1a1a;
                  }
                  em {
                    font-style: italic;
                  }
                  code {
                    background-color: #f5f4f0;
                    color: #a8956b;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Courier New', monospace;
                    font-size: 0.9em;
                  }
                  pre {
                    background-color: #f5f4f0;
                    color: #1f2226;
                    padding: 1rem;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1.5em 0;
                  }
                  pre code {
                    background-color: transparent;
                    padding: 0;
                  }
                  blockquote {
                    border-left: 4px solid #a8956b;
                    padding-left: 1.5rem;
                    margin: 1.5em 0;
                    color: #4f5358;
                    font-style: italic;
                  }
                  ul, ol {
                    margin: 1em 0;
                    padding-left: 2em;
                  }
                  li {
                    margin: 0.5em 0;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1.5em 0;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1.5em 0;
                  }
                  table th,
                  table td {
                    border: 1px solid #e0e0e0;
                    padding: 0.75rem;
                    text-align: left;
                  }
                  table th {
                    background-color: #f5f4f0;
                    font-weight: 600;
                    color: #1a1a1a;
                  }
                  hr {
                    border: none;
                    border-top: 2px solid #e0e0e0;
                    margin: 2em 0;
                  }
                `,
            }}
            onEditorChange={onChange}
          />
        )}
      />
      </div>
    </div>
  );
}
