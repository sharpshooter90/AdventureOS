import { PageLayout } from "../components/layout/page-layout";
import {
  WindowManagerProvider,
  useWindowManager,
} from "../components/window/window-manager";
import { DesktopIcon } from "../components/desktop/desktop-icon";
import { Content } from "../components/content/about-content";
import { FolderContent } from "../components/content/folder-content";
import { WhiteboardExcalidraw } from "../components/desktop/whiteboard-excalidraw";
import { useState, useEffect } from "react";
import { getApplicationForFile, ApplicationType } from "../types/applications";
import "./desktop.css";

// Sample content for files and folders
const projectItems = [
  {
    id: "project1",
    name: "Project1.md",
    type: "file",
    icon: "📄",
    content: "# Project 1\n\nThis is project 1's documentation.",
    size: "2 KB",
    modified: "2024-01-20",
  },
  {
    id: "project2",
    name: "Project2.md",
    type: "file",
    icon: "📄",
    content: "# Project 2\n\nThis is project 2's documentation.",
    size: "1.5 KB",
    modified: "2024-01-21",
  },
  {
    id: "project-assets",
    name: "Assets",
    type: "folder",
    icon: "📁",
    content: [
      {
        id: "logo",
        name: "logo.png",
        type: "file",
        icon: "🖼️",
        content: null,
        size: "50 KB",
        modified: "2024-01-15",
      },
      {
        id: "design",
        name: "design.fig",
        type: "file",
        icon: "🎨",
        content: null,
        size: "2.5 MB",
        modified: "2024-01-18",
      },
    ],
    size: "2.55 MB",
    modified: "2024-01-18",
  },
];

const playgroundItems = [
  {
    id: "game1",
    name: "Game1.txt",
    type: "file",
    icon: "🎮",
    content: "Game 1 instructions and notes",
    size: "1 KB",
    modified: "2024-01-19",
  },
  {
    id: "game2",
    name: "Game2.txt",
    type: "file",
    icon: "🎮",
    content: "Game 2 instructions and notes",
    size: "1.2 KB",
    modified: "2024-01-20",
  },
  {
    id: "saves",
    name: "Saves",
    type: "folder",
    icon: "📁",
    content: [
      {
        id: "save1",
        name: "save1.dat",
        type: "file",
        icon: "💾",
        content: null,
        size: "128 KB",
        modified: "2024-01-22",
      },
      {
        id: "save2",
        name: "save2.dat",
        type: "file",
        icon: "💾",
        content: null,
        size: "256 KB",
        modified: "2024-01-23",
      },
    ],
    size: "384 KB",
    modified: "2024-01-23",
  },
];

const workItems = [
  {
    id: "resume",
    name: "Resume.txt",
    type: "file",
    icon: "📄",
    content: "Professional resume and experience",
    size: "3 KB",
    modified: "2024-01-18",
  },
  {
    id: "experience",
    name: "Experience.md",
    type: "file",
    icon: "📄",
    content: "# Work Experience\n\nDetailed work history and achievements",
    size: "4 KB",
    modified: "2024-01-17",
  },
  {
    id: "certificates",
    name: "Certificates",
    type: "folder",
    icon: "📁",
    content: [
      {
        id: "cert1",
        name: "Certificate1.pdf",
        type: "file",
        icon: "📜",
        content: null,
        size: "500 KB",
        modified: "2024-01-10",
      },
      {
        id: "cert2",
        name: "Certificate2.pdf",
        type: "file",
        icon: "📜",
        content: null,
        size: "750 KB",
        modified: "2024-01-12",
      },
    ],
    size: "1.25 MB",
    modified: "2024-01-12",
  },
];

interface DesktopItem {
  id: string;
  label: string;
  type: "folder" | "file" | "text";
  icon?: string;
  content: any;
  defaultPosition: { x: number; y: number };
  size?: string;
  modified?: string;
}

const desktopItems: DesktopItem[] = [
  {
    id: "about",
    label: "About.md",
    type: "text",
    icon: "📄",
    content: "# About Me\n\nWelcome to my portfolio!",
    defaultPosition: { x: 20, y: 20 },
    size: "1 KB",
    modified: "2024-01-24",
  },
  {
    id: "projects",
    label: "Projects",
    type: "folder",
    icon: "📁",
    content: { items: projectItems },
    defaultPosition: { x: 120, y: 20 },
    size: "10 KB",
    modified: "2024-01-24",
  },
  {
    id: "playground",
    label: "Playground",
    type: "folder",
    icon: "📁",
    content: { items: playgroundItems },
    defaultPosition: { x: 220, y: 20 },
    size: "5 KB",
    modified: "2024-01-24",
  },
  {
    id: "work",
    label: "Work",
    type: "folder",
    icon: "📁",
    content: { items: workItems },
    defaultPosition: { x: 320, y: 20 },
    size: "8 KB",
    modified: "2024-01-24",
  },
  {
    id: "whiteboard",
    label: "whiteboard.excalidraw",
    type: "file",
    icon: "🖌️",
    content: {
      data: "", // Initial empty whiteboard
    },
    defaultPosition: { x: 420, y: 20 },
    size: "0 KB",
    modified: "2024-01-24",
  },
  {
    id: "devtools",
    label: "DevTools",
    type: "file",
    icon: "🛠️",
    content: null,
    defaultPosition: { x: 520, y: 20 },
    size: "0 KB",
    modified: "2024-01-24",
  },
];

interface IconPosition {
  id: string;
  position: { x: number; y: number };
}

function Desktop() {
  const { dispatch } = useWindowManager();
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  });

  useEffect(() => {
    const savedPositions = localStorage.getItem("desktopIconPositions");
    if (savedPositions) {
      setIconPositions(JSON.parse(savedPositions));
    }
  }, []);

  useEffect(() => {
    if (iconPositions.length > 0) {
      localStorage.setItem(
        "desktopIconPositions",
        JSON.stringify(iconPositions)
      );
    }
  }, [iconPositions]);

  const getIconPosition = (id: string) => {
    const savedPosition = iconPositions.find((icon) => icon.id === id);
    const defaultItem = desktopItems.find((item) => item.id === id);
    return (
      savedPosition?.position || defaultItem?.defaultPosition || { x: 0, y: 0 }
    );
  };

  const handlePositionChange = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    setIconPositions((prev) => {
      const existing = prev.findIndex((icon) => icon.id === id);
      if (existing !== -1) {
        const newPositions = [...prev];
        newPositions[existing] = { id, position: newPosition };
        return newPositions;
      }
      return [...prev, { id, position: newPosition }];
    });
  };

  const handleItemOpen = (item: DesktopItem) => {
    let appType = ApplicationType.TEXT;

    switch (item.type) {
      case "folder":
        appType = ApplicationType.FOLDER;
        break;
      case "file":
        if (item.id === "whiteboard") {
          appType = ApplicationType.WHITEBOARD;
        } else if (item.id === "devtools") {
          appType = ApplicationType.DEVTOOLS;
        }
        break;
      case "text":
        appType = ApplicationType.TEXT;
        break;
    }

    dispatch({
      type: "OPEN_WINDOW",
      payload: {
        id:
          item.type === "folder"
            ? `folder-${item.label}`
            : `file-${item.label}`,
        title: item.label,
        appType,
        content: item.content,
      },
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("desktop-background")) {
      setIsSelecting(true);
      setSelectionBox({
        start: { x: e.clientX, y: e.clientY },
        current: { x: e.clientX, y: e.clientY },
      });
      if (!e.shiftKey) {
        setSelectedItems([]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting) {
      setSelectionBox((prev) => ({
        ...prev,
        current: { x: e.clientX, y: e.clientY },
      }));
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      const selected = desktopItems.filter((item) => {
        const pos = getIconPosition(item.id);
        return isInSelectionBox(pos, selectionBox);
      });
      setSelectedItems((prev) => [
        ...new Set([...prev, ...selected.map((item) => item.id)]),
      ]);
    }
  };

  const isInSelectionBox = (
    pos: { x: number; y: number },
    box: typeof selectionBox
  ) => {
    const left = Math.min(box.start.x, box.current.x);
    const right = Math.max(box.start.x, box.current.x);
    const top = Math.min(box.start.y, box.current.y);
    const bottom = Math.max(box.start.y, box.current.y);

    return pos.x >= left && pos.x <= right && pos.y >= top && pos.y <= bottom;
  };

  const handleIconClick = (id: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.shiftKey) {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedItems([id]);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full h-full p-4 desktop-background"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {desktopItems.map((item) => (
        <DesktopIcon
          key={item.id}
          id={item.id}
          label={item.label}
          type={item.type}
          icon={item.icon}
          content={item.content}
          defaultPosition={getIconPosition(item.id)}
          onPositionChange={(position) =>
            handlePositionChange(item.id, position)
          }
          onOpen={() => handleItemOpen(item)}
          onClick={(e) => handleIconClick(item.id, e)}
          isSelected={selectedItems.includes(item.id)}
        />
      ))}

      {isSelecting && (
        <div
          style={{
            position: "absolute",
            left: Math.min(selectionBox.start.x, selectionBox.current.x),
            top: Math.min(selectionBox.start.y, selectionBox.current.y),
            width: Math.abs(selectionBox.current.x - selectionBox.start.x),
            height: Math.abs(selectionBox.current.y - selectionBox.start.y),
            border: "1px solid #0066cc",
            backgroundColor: "rgba(0, 102, 204, 0.1)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <WindowManagerProvider>
      <PageLayout hideNav>
        <Desktop />
      </PageLayout>
    </WindowManagerProvider>
  );
}
