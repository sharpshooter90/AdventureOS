import { PageLayout } from "../components/layout/page-layout";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/components/window/window-manager";
import { DesktopIcon } from "@/components/desktop/desktop-icon";
import { Content } from "@/components/content/about-content";
import { FolderContent } from "@/components/content/folder-content";

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

function Desktop() {
  const { dispatch } = useWindowManager();

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
    <div className="min-h-screen p-8 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] auto-rows-max gap-4 content-start">
      {desktopItems.map((item) => (
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

export default function HomePage() {
  return (
    <WindowManagerProvider>
      <PageLayout hideNav>
        <Desktop />
      </PageLayout>
    </WindowManagerProvider>
  );
}
