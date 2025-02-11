import { useState } from "react";
import { IconView, ListView } from "./views";

interface FileExplorerProps {
  path: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
    icon?: string;
    size?: string;
    modified?: string;
  }>;
}

export function FileExplorer({ path, items }: FileExplorerProps) {
  const [viewMode, setViewMode] = useState<"icons" | "list">("icons");

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="window-toolbar">
        <button
          className={`toolbar-button ${viewMode === "icons" ? "active" : ""}`}
          onClick={() => setViewMode("icons")}
        >
          Icons
        </button>
        <button
          className={`toolbar-button ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          List
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === "icons" ? (
          <IconView items={items} />
        ) : (
          <ListView items={items} />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-2 py-1 bg-gray-200 border-t border-gray-300 text-sm">
        {items.length} items | {path}
      </div>
    </div>
  );
}
