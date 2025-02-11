import { useState } from "react";

interface TextEditorProps {
  filename: string;
  content: string;
  onSave?: (content: string) => void;
}

export function TextEditor({ filename, content, onSave }: TextEditorProps) {
  const [text, setText] = useState(content);
  const [isEdited, setIsEdited] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsEdited(true);
  };

  const handleSave = () => {
    onSave?.(text);
    setIsEdited(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="window-toolbar">
        <button
          className="toolbar-button"
          onClick={handleSave}
          disabled={!isEdited}
        >
          Save
        </button>
        <button className="toolbar-button">Cut</button>
        <button className="toolbar-button">Copy</button>
        <button className="toolbar-button">Paste</button>
        <div className="border-l border-gray-300 mx-2" />
        <button className="toolbar-button">Find</button>
        <button className="toolbar-button">Replace</button>
      </div>

      {/* Editor */}
      <textarea
        className="flex-1 p-4 font-mono text-sm resize-none outline-none border-none"
        value={text}
        onChange={handleChange}
        spellCheck={false}
      />

      {/* Status Bar */}
      <div className="px-2 py-1 bg-gray-200 border-t border-gray-300 text-sm flex justify-between">
        <span>{filename}</span>
        <span>{isEdited ? "Modified" : "Saved"}</span>
      </div>
    </div>
  );
}
