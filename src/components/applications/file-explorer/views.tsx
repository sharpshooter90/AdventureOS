import { useWindowManager } from "../../window/window-manager";
import { getApplicationForFile } from "../../../types/applications";
import { soundManager } from "../../dialog/sound-manager";

interface FileItem {
  id: string;
  name: string;
  type: string;
  icon?: string;
  size?: string;
  modified?: string;
  content?: any;
}

interface ViewProps {
  items: FileItem[];
}

export function IconView({ items }: ViewProps) {
  const { dispatch } = useWindowManager();

  const handleDoubleClick = (item: FileItem) => {
    soundManager.play("actionClick");
    if (item.type === "folder") {
      dispatch({
        type: "OPEN_WINDOW",
        payload: {
          id: `folder-${item.name}`,
          title: item.name,
          appType: "fileExplorer",
          content: {
            path: item.name,
            items: item.content || [],
          },
        },
      });
    } else {
      const appType = getApplicationForFile(item.name);
      dispatch({
        type: "OPEN_WINDOW",
        payload: {
          id: `file-${item.name}`,
          title: item.name,
          appType,
          content: {
            text: item.content || "",
            onSave: (newContent: string) => {
              console.log("Saving file:", item.name, newContent);
            },
          },
        },
      });
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 p-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center gap-1 p-2 cursor-pointer hover:bg-blue-100 rounded"
          onDoubleClick={() => handleDoubleClick(item)}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            {item.icon ? (
              <span className="text-2xl">{item.icon}</span>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold rounded">
                {item.type[0].toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-center text-sm truncate w-full">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ListView({ items }: ViewProps) {
  const { dispatch } = useWindowManager();

  const handleDoubleClick = (item: FileItem) => {
    soundManager.play("actionClick");
    if (item.type === "folder") {
      dispatch({
        type: "OPEN_WINDOW",
        payload: {
          id: `folder-${item.name}`,
          title: item.name,
          appType: "fileExplorer",
          content: {
            path: item.name,
            items: item.content || [],
          },
        },
      });
    } else {
      const appType = getApplicationForFile(item.name);
      dispatch({
        type: "OPEN_WINDOW",
        payload: {
          id: `file-${item.name}`,
          title: item.name,
          appType,
          content: {
            text: item.content || "",
            onSave: (newContent: string) => {
              console.log("Saving file:", item.name, newContent);
            },
          },
        },
      });
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-2 px-4 py-2 bg-gray-100 font-bold text-sm border-b border-gray-200">
        <div>Name</div>
        <div>Type</div>
        <div>Size</div>
        <div>Modified</div>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-2 px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
          onDoubleClick={() => handleDoubleClick(item)}
        >
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 flex items-center justify-center">
              {item.icon ? (
                <span className="text-sm">{item.icon}</span>
              ) : (
                <span className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs rounded">
                  {item.type[0].toUpperCase()}
                </span>
              )}
            </span>
            {item.name}
          </div>
          <div>{item.type}</div>
          <div>{item.size || "--"}</div>
          <div>{item.modified || "--"}</div>
        </div>
      ))}
    </div>
  );
}
