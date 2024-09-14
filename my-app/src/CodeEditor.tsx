import React from "react";
import MonacoEditor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => {
  return (
    <MonacoEditor
      height="400px"
      width="400px"
      language="javascript"
      value={code}
      theme="vs-dark"
      onChange={(newCode) => setCode(newCode || "")}
    />
  );
};

export default CodeEditor;
