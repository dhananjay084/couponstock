"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const WysiwygEditor = ({ onContentChange, initialContent }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (initialContent) {
      const contentBlock = htmlToDraft(initialContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [initialContent]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawContentState = convertToRaw(state.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    onContentChange(htmlContent);
  };

  return (
    <div className="border rounded-md px-2 py-1 bg-white">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="demo-wrapper"
        editorClassName="min-h-[200px] px-2"
      />
    </div>
  );
};

export default WysiwygEditor;
