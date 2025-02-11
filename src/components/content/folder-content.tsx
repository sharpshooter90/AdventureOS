import { DesktopIcon } from "../desktop/desktop-icon";
import { useWindowManager } from "../window/window-manager";

interface FolderContentProps {
  items: {
    icon: string;
    label: string;
    type: "file" | "folder";
    content?: React.ReactNode;
  }[];
}

export function FolderContent({ items }: FolderContentProps) {
  const { dispatch } = useWindowManager();

  const handleItemOpen = (item: (typeof items)[0]) => {
    if (item.type === "folder") {
      dispatch({
        type: "OPEN_WINDOW",
        payload: {
          id: `folder-${item.label}`,
          title: item.label,
          content: item.content || (
            <div className="text-center text-muted-foreground p-4">
              This folder is empty
            </div>
          ),
        },
      });
    } else if (item.content) {
      dispatch({
        type: "OPEN_WINDOW",
        payload: {
          id: `file-${item.label}`,
          title: item.label,
          content: item.content,
        },
      });
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 p-4">
      {items.map((item) => (
        <DesktopIcon
          key={item.label}
          icon={item.icon}
          label={item.label}
          type={item.type}
          onDoubleClick={() => handleItemOpen(item)}
        />
      ))}
    </div>
  );
}
