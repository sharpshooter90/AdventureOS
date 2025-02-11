interface WhiteboardViewerProps {
  filename: string;
  content?: string;
}

export function WhiteboardViewer({ filename, content }: WhiteboardViewerProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="window-toolbar">
        <button className="toolbar-button">Save</button>
        <button className="toolbar-button">Export</button>
        <button className="toolbar-button">Share</button>
      </div>

      {/* Whiteboard Content */}
      <div className="flex-1 bg-white">
        <iframe
          src="https://excalidraw.com/"
          className="w-full h-full border-none"
          title={filename}
          allow="clipboard-write"
        />
      </div>

      {/* Status Bar */}
      <div className="px-2 py-1 bg-gray-200 border-t border-gray-300 text-sm flex justify-between">
        <span>{filename}</span>
        <span>Ready</span>
      </div>
    </div>
  );
}
