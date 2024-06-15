import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./App.css"; // For custom styles

const EditorComponent = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedData = localStorage.getItem("content");
    return savedData
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedData)))
      : EditorState.createEmpty();
  });

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars, state) => {
    const currentContent = state.getCurrentContent();
    const selection = state.getSelection();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const blockText = block.getText().slice(0, selection.getStartOffset());

    if (blockText === "#" && chars === " ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "backward"
      );
      const newState = EditorState.push(state, newContentState, "remove-range");
      setEditorState(RichUtils.toggleBlockType(newState, "header-one"));
      return "handled";
    }
    if (blockText === "*" && chars === " ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "backward"
      );
      const newState = EditorState.push(state, newContentState, "remove-range");
      setEditorState(RichUtils.toggleInlineStyle(newState, "BOLD"));
      return "handled";
    }
    if (blockText === "**" && chars === " ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        "backward"
      );
      const newState = EditorState.push(state, newContentState, "remove-range");
      setEditorState(RichUtils.toggleInlineStyle(newState, "RED"));
      return "handled";
    }
    if (blockText === "***" && chars === " ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        "backward"
      );
      const newState = EditorState.push(state, newContentState, "remove-range");
      setEditorState(RichUtils.toggleInlineStyle(newState, "UNDERLINE"));
      return "handled";
    }
    if (blockText === "`````" && chars === " ") {
      const newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 5,
        }),
        "backward"
      );
      const newState = EditorState.push(state, newContentState, "remove-range");
      setEditorState(RichUtils.toggleBlockType(newState, "code-block"));
      return "handled";
    }
    return "not-handled";
  };

  const handleSave = () => {
    const content = editorState.getCurrentContent();
    const raw = convertToRaw(content);
    localStorage.setItem("content", JSON.stringify(raw));
  };

  const styleMap = {
    RED: {
      color: "red",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
  };

  return (
    <div className="editor-container">
      <h1>Demo editor by Archisman</h1>
      <div className="editor-wrapper">
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default EditorComponent;
