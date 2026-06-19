import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = forwardRef(({ value = "", onChange, placeholder = "Write here..." }, ref) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
      });

      // Set initial content if value is provided
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for text changes
      quillRef.current.on("text-change", () => {
        if (!isInternalChange.current && onChange) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  // Update content when value prop changes from parent
  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        isInternalChange.current = true;
        quillRef.current.root.innerHTML = value || "";
        isInternalChange.current = false;
      }
    }
  }, [value]);

  // Expose quill instance to parent via ref
  useImperativeHandle(ref, () => ({
    getQuill: () => quillRef.current,
    getContent: () => quillRef.current?.root.innerHTML || "",
    setContent: (html) => {
      if (quillRef.current) {
        isInternalChange.current = true;
        quillRef.current.root.innerHTML = html;
        isInternalChange.current = false;
      }
    },
  }));

  return (
    <div>
      <div ref={editorRef} style={{ minHeight: "200px", backgroundColor: "white" }} />
    </div>
  );
});

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
