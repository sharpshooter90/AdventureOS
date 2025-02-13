export enum ApplicationType {
  FOLDER = "FOLDER",
  TEXT = "TEXT",
  WHITEBOARD = "WHITEBOARD",
  DEVTOOLS = "DEVTOOLS",
  FILE_EXPLORER = "FILE_EXPLORER",
  TEXT_EDITOR = "TEXT_EDITOR",
  IMAGE_VIEWER = "IMAGE_VIEWER",
  TERMINAL = "TERMINAL",
  SETTINGS = "SETTINGS",
  BROWSER = "BROWSER",
  CALCULATOR = "CALCULATOR",
  AUDIO_PLAYER = "AUDIO_PLAYER",
  MULTIPLAYER_SETTINGS = "MULTIPLAYER_SETTINGS",
  CUSTOM = "custom",
}

export interface ApplicationInfo {
  name: string;
  icon: string;
  defaultSize: { width: number; height: number };
  title?: string;
}

export const ApplicationMap: Record<ApplicationType, ApplicationInfo> = {
  [ApplicationType.FOLDER]: {
    name: "Folder",
    icon: "📁",
    defaultSize: { width: 600, height: 400 },
  },
  [ApplicationType.TEXT]: {
    name: "Text Editor",
    icon: "📝",
    defaultSize: { width: 600, height: 400 },
  },
  [ApplicationType.WHITEBOARD]: {
    name: "Whiteboard",
    icon: "🖌️",
    defaultSize: { width: 800, height: 600 },
  },
  [ApplicationType.DEVTOOLS]: {
    name: "DevTools",
    icon: "🛠️",
    defaultSize: { width: 800, height: 600 },
  },
  [ApplicationType.FILE_EXPLORER]: {
    name: "File Explorer",
    icon: "📂",
    defaultSize: { width: 600, height: 400 },
  },
  [ApplicationType.TEXT_EDITOR]: {
    name: "Text Editor",
    icon: "📝",
    defaultSize: { width: 600, height: 400 },
  },
  [ApplicationType.IMAGE_VIEWER]: {
    name: "Image Viewer",
    icon: "🖼️",
    defaultSize: { width: 600, height: 400 },
  },
  [ApplicationType.TERMINAL]: {
    name: "Terminal",
    icon: "💻",
    defaultSize: { width: 600, height: 400 },
  },
  [ApplicationType.SETTINGS]: {
    name: "Settings",
    icon: "⚙️",
    defaultSize: { width: 500, height: 600 },
  },
  [ApplicationType.BROWSER]: {
    name: "Browser",
    icon: "🌐",
    defaultSize: { width: 800, height: 600 },
  },
  [ApplicationType.CALCULATOR]: {
    name: "Calculator",
    icon: "🧮",
    defaultSize: { width: 300, height: 400 },
  },
  [ApplicationType.AUDIO_PLAYER]: {
    name: "Audio Player",
    icon: "📻",
    defaultSize: { width: 350, height: 450 },
  },
  [ApplicationType.MULTIPLAYER_SETTINGS]: {
    name: "Multiplayer Settings",
    icon: "👥",
    defaultSize: { width: 500, height: 600 },
    title: "Multiplayer Settings",
  },
  [ApplicationType.CUSTOM]: {
    name: "Custom Application",
    icon: "🔧",
    defaultSize: { width: 500, height: 600 },
  },
};

export function getApplicationForFile(filename: string): ApplicationType {
  const extension = filename.toLowerCase().split(".").pop();
  if (!extension) return ApplicationType.TEXT_EDITOR; // Default to text editor if no extension

  // Default mappings for common file types
  switch (extension) {
    case "txt":
    case "md":
      return ApplicationType.TEXT_EDITOR;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return ApplicationType.IMAGE_VIEWER;
    case "html":
    case "url":
      return ApplicationType.BROWSER;
    case "excalidraw":
      return ApplicationType.WHITEBOARD;
    default:
      return ApplicationType.TEXT_EDITOR; // Default to text editor for unknown file types
  }
}
