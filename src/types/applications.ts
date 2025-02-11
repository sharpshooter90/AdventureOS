export type ApplicationType =
  | "fileExplorer"
  | "textEditor"
  | "imageViewer"
  | "terminal"
  | "settings"
  | "browser"
  | "calculator"
  | "whiteboard";

export interface ApplicationInfo {
  name: string;
  icon: string;
  title: string;
  fileExtensions?: string[];
  defaultSize?: {
    width: number;
    height: number;
  };
}

export const ApplicationMap: Record<ApplicationType, ApplicationInfo> = {
  fileExplorer: {
    name: "File Explorer",
    icon: "📁",
    title: "Explorer",
    defaultSize: {
      width: 800,
      height: 600,
    },
  },
  textEditor: {
    name: "Text Editor",
    icon: "📝",
    title: "Notepad",
    fileExtensions: [".txt", ".md"],
    defaultSize: {
      width: 600,
      height: 400,
    },
  },
  imageViewer: {
    name: "Image Viewer",
    icon: "🖼️",
    title: "Image Viewer",
    fileExtensions: [".png", ".jpg", ".gif"],
    defaultSize: {
      width: 800,
      height: 600,
    },
  },
  terminal: {
    name: "Terminal",
    icon: "⌨️",
    title: "Terminal",
    defaultSize: {
      width: 600,
      height: 400,
    },
  },
  settings: {
    name: "Settings",
    icon: "⚙️",
    title: "Settings",
    defaultSize: {
      width: 600,
      height: 500,
    },
  },
  browser: {
    name: "Browser",
    icon: "🌐",
    title: "Browser",
    fileExtensions: [".html", ".url"],
    defaultSize: {
      width: 1024,
      height: 768,
    },
  },
  calculator: {
    name: "Calculator",
    icon: "🧮",
    title: "Calculator",
    defaultSize: {
      width: 300,
      height: 400,
    },
  },
  whiteboard: {
    name: "Whiteboard",
    icon: "🖌️",
    title: "Excalidraw",
    fileExtensions: [".excalidraw"],
    defaultSize: {
      width: 1024,
      height: 768,
    },
  },
};

export function getApplicationForFile(filename: string): ApplicationType {
  const extension = filename.toLowerCase().split(".").pop();
  if (!extension) return "textEditor"; // Default to text editor if no extension

  for (const [appType, appInfo] of Object.entries(ApplicationMap)) {
    if (appInfo.fileExtensions?.includes(`.${extension}`)) {
      return appType as ApplicationType;
    }
  }

  // Default mappings for common file types
  switch (extension) {
    case "txt":
    case "md":
      return "textEditor";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "imageViewer";
    case "html":
    case "url":
      return "browser";
    case "excalidraw":
      return "whiteboard";
    default:
      return "textEditor"; // Default to text editor for unknown file types
  }
}
