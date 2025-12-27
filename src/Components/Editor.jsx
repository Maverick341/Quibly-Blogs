// RTE.jsx
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import EditorJS from "@editorjs/editorjs";

import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import SimpleImage from "@editorjs/simple-image";

// EditorJS is not React StrictMode safe.
// isInitialized prevents double initialization during dev-only double mount.
const Editor = forwardRef(({ defaultValue }, ref) => {
  const holderRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const isInitialized = useRef(false);

  useImperativeHandle(ref, () => ({
    async save() {
      if (!editorInstanceRef.current) return null;
      return await editorInstanceRef.current.save();
    },
  }));

  useEffect(() => {
    if (isInitialized.current) return;
    if (!holderRef.current) return;

    isInitialized.current = true;

    const editor = new EditorJS({
      holder: holderRef.current,
      data: defaultValue || { blocks: [] },
      placeholder: "Start writing your article…",
      autofocus: true,
      tools: {
        paragraph: { class: Paragraph, inlineToolbar: true },
        header: {
          class: Header,
          inlineToolbar: true,
          config: { levels: [2, 3, 4], defaultLevel: 2 },
        },
        list: {
          class: EditorjsList,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        code: CodeTool,
        image: SimpleImage,
      },
    });

    editorInstanceRef.current = editor;

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  return (
    <div
      ref={holderRef}
      className="min-h-[300px] rounded-sm px-2 py-1" // border bg-[#f8f7f4] dark:bg-[#35383c] border-[#e5e4e0] dark:border-[#4a4d52] 
    />
  );
});

export default Editor;
