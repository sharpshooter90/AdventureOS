import { DesktopIcon } from "../desktop/desktop-icon";
import { useWindowManager } from "../window/window-manager";
import { ApplicationType } from "../../types/applications";
import { useState, useRef, useEffect } from "react";

interface FolderItem {
  id: string;
  name: string;
  type: "file" | "folder";
  icon: string;
  content: any;
  size?: string;
  modified?: string;
}

interface FolderContentProps {
  items?: FolderItem[];
}

type ViewMode = "grid" | "list";

const GRID_ITEM_WIDTH = 100;
const GRID_ITEM_HEIGHT = 100;
const GRID_GAP = 16;
const GRID_PADDING = 16;

export function FolderContent({ items = [] }: FolderContentProps) {
  const { dispatch } = useWindowManager();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridDimensions, setGridDimensions] = useState({ columns: 1, rows: 1 });

  useEffect(() => {
    const updateGridDimensions = () => {
      if (gridContainerRef.current) {
        const containerWidth =
          gridContainerRef.current.clientWidth - GRID_PADDING * 2;
        const columns = Math.floor(
          (containerWidth + GRID_GAP) / (GRID_ITEM_WIDTH + GRID_GAP)
        );
        const rows = Math.ceil(folderItems.length / columns);
        setGridDimensions({ columns, rows });
      }
    };

    updateGridDimensions();
    window.addEventListener("resize", updateGridDimensions);
    return () => window.removeEventListener("resize", updateGridDimensions);
  }, [items]);

  const getItemPosition = (index: number) => {
    const column = index % gridDimensions.columns;
    const row = Math.floor(index / gridDimensions.columns);
    return {
      x: GRID_PADDING + column * (GRID_ITEM_WIDTH + GRID_GAP),
      y: GRID_PADDING + row * (GRID_ITEM_HEIGHT + GRID_GAP),
    };
  };

  const handleItemOpen = (item: FolderItem) => {
    let appType =
      item.type === "folder" ? ApplicationType.FOLDER : ApplicationType.TEXT;

    // For files with specific extensions, determine the correct app type
    if (item.type === "file") {
      const extension = item.name.toLowerCase().split(".").pop();
      switch (extension) {
        case "excalidraw":
          appType = ApplicationType.WHITEBOARD;
          break;
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
          appType = ApplicationType.IMAGE_VIEWER;
          break;
        case "md":
          appType = ApplicationType.TEXT;
          break;
        default:
          appType = ApplicationType.TEXT;
      }
    }

    dispatch({
      type: "OPEN_WINDOW",
      payload: {
        id: `${item.type}-${item.name}`,
        title: item.name,
        appType,
        content:
          item.type === "folder" ? { items: item.content } : item.content,
      },
    });
  };

  // Ensure we're working with the correct items array
  const folderItems = Array.isArray(items) ? items : [];

  if (folderItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        This folder is empty
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm bg-secondary rounded hover:bg-secondary/80">
            New Folder
          </button>
          <button className="px-3 py-1 text-sm bg-secondary rounded hover:bg-secondary/80">
            Upload
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            className={`p-2 rounded hover:bg-secondary/80 ${
              viewMode === "grid" ? "bg-secondary" : ""
            }`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            <span role="img" aria-label="Grid View">
              📱
            </span>
          </button>
          <button
            className={`p-2 rounded hover:bg-secondary/80 ${
              viewMode === "list" ? "bg-secondary" : ""
            }`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            <span role="img" aria-label="List View">
              📋
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {viewMode === "grid" ? (
          <div
            ref={gridContainerRef}
            className="relative w-full h-full min-h-[200px]"
            style={{
              height: `${
                GRID_PADDING * 2 +
                gridDimensions.rows * (GRID_ITEM_HEIGHT + GRID_GAP) -
                GRID_GAP
              }px`,
            }}
          >
            {folderItems.map((item, index) => (
              <div
                key={item.id}
                className="absolute"
                style={{
                  transform: `translate(${getItemPosition(index).x}px, ${
                    getItemPosition(index).y
                  }px)`,
                  width: GRID_ITEM_WIDTH,
                  height: GRID_ITEM_HEIGHT,
                }}
              >
                <DesktopIcon
                  id={item.id}
                  label={item.name}
                  type={item.type}
                  icon={item.icon}
                  content={item.content}
                  defaultPosition={{ x: 0, y: 0 }}
                  onPositionChange={() => {}}
                  onOpen={() => handleItemOpen(item)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-sm">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Size</th>
                  <th className="text-left p-2">Modified</th>
                </tr>
              </thead>
              <tbody>
                {folderItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-secondary/10 cursor-pointer"
                    onDoubleClick={() => handleItemOpen(item)}
                  >
                    <td className="p-2 flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      {item.name}
                    </td>
                    <td className="p-2">{item.type}</td>
                    <td className="p-2">{item.size || "-"}</td>
                    <td className="p-2">{item.modified || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t p-2 text-sm text-muted-foreground">
        {folderItems.length} items
      </div>
    </div>
  );
}
