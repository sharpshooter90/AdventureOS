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
import { getApplicationForFile } from "../types/applications";

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
];

interface DesktopItem {
  id: string;
  label: string;
  type: "folder" | "file" | "text";
  icon?: string;
  content: any;
  defaultPosition: { x: number; y: number };
}

const desktopItems: DesktopItem[] = [
  {
    id: "about",
    label: "About.md",
    type: "text",
    icon: "📄",
    content: "# About Me\n\nWelcome to my portfolio!",
    defaultPosition: { x: 20, y: 20 },
  },
  {
    id: "projects",
    label: "Projects",
    type: "folder",
    icon: "📁",
    content: projectItems,
    defaultPosition: { x: 120, y: 20 },
  },
  {
    id: "playground",
    label: "Playground",
    type: "folder",
    icon: "📁",
    content: playgroundItems,
    defaultPosition: { x: 220, y: 20 },
  },
  {
    id: "work",
    label: "Work",
    type: "folder",
    icon: "📁",
    content: workItems,
    defaultPosition: { x: 320, y: 20 },
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
  },
];

interface IconPosition {
  id: string;
  position: { x: number; y: number };
}

function Desktop() {
  const { dispatch } = useWindowManager();
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);

  // Load saved positions from localStorage on mount
  useEffect(() => {
    const savedPositions = localStorage.getItem("desktopIconPositions");
    if (savedPositions) {
      setIconPositions(JSON.parse(savedPositions));
    }
  }, []);

  // Save positions to localStorage when they change
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
    dispatch({
      type: "OPEN_WINDOW",
      payload: {
        id:
          item.type === "folder"
            ? `folder-${item.label}`
            : `file-${item.label}`,
        title: item.label,
        content: item.content,
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full h-full p-4">
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
          onDoubleClick={() => handleItemOpen(item)}
        />
      ))}
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
