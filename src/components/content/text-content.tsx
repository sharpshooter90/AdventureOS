import React from "react";
import ReactMarkdown from "react-markdown";

interface TextContentProps {
  content?: string | { text?: string };
}

export function TextContent({ content = "" }: TextContentProps) {
  const textContent =
    typeof content === "string" ? content : content?.text || "";

  return (
    <div className="p-4 h-full overflow-auto">
      <ReactMarkdown>{textContent}</ReactMarkdown>
    </div>
  );
}
