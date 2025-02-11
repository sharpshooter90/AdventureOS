import { PageLayout } from "../components/layout/page-layout";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/components/window/window-manager";
import { DesktopIcon } from "@/components/desktop/desktop-icon";
import { Content } from "@/components/content/about-content";
import { FolderContent } from "@/components/content/folder-content";
import { useState, useEffect } from "react";

const projectItems = [
  {
    icon: "📄",
    label: "Project1.md",
    type: "file" as const,
    content: <div>Project 1 content</div>,
  },
  {
    icon: "📄",
    label: "Project2.md",
    type: "file" as const,
    content: <div>Project 2 content</div>,
  },
];

const playgroundItems = [
  {
    icon: "🎮",
    label: "Game1.exe",
    type: "file" as const,
    content: <div>Game 1 content</div>,
  },
  {
    icon: "🎮",
    label: "Game2.exe",
    type: "file" as const,
    content: <div>Game 2 content</div>,
  },
];

const workItems = [
  {
    icon: "💼",
    label: "Resume.pdf",
    type: "file" as const,
    content: <div>Resume content</div>,
  },
  {
    icon: "📄",
    label: "Experience.md",
    type: "file" as const,
    content: <div>Experience content</div>,
  },
];

const desktopItems = [
  {
    icon: "📄",
    label: "About.md",
    type: "file" as const,
    content: <Content />,
  },
  {
    icon: "📁",
    label: "Projects",
    type: "folder" as const,
    content: <FolderContent items={projectItems} />,
  },
  {
    icon: "📁",
    label: "Playground",
    type: "folder" as const,
    content: <FolderContent items={playgroundItems} />,
  },
  {
    icon: "📁",
    label: "Work",
    type: "folder" as const,
    content: <FolderContent items={workItems} />,
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
    return savedPosition?.position || { x: 0, y: 0 };
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

  const handleItemOpen = (item: (typeof desktopItems)[0]) => {
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
          key={item.label}
          icon={item.icon}
          label={item.label}
          type={item.type}
          onDoubleClick={() => handleItemOpen(item)}
          defaultPosition={getIconPosition(item.label)}
          onPositionChange={(position) =>
            handlePositionChange(item.label, position)
          }
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
