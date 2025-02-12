import React from "react";

interface WhiteboardExcalidrawProps {
  content?: {
    data?: string;
  };
}

export function WhiteboardExcalidraw({ content }: WhiteboardExcalidrawProps) {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://excalidraw.com/#room=faf47ad57a92b65de774,NF4c2KKyjSkG_8Vy9W8nnw"
        title="Excalidraw Whiteboard"
        frameBorder="0"
        className="w-full h-full"
      />
    </div>
  );
}
