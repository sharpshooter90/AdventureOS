import {
  ApplicationType,
  ApplicationMap,
  getApplicationForFile,
} from "../../types/applications";
import { FileExplorer } from "./file-explorer/file-explorer";
import { TextEditor } from "./text-editor/text-editor";
import { WhiteboardViewer } from "./whiteboard/whiteboard-viewer";
import { FolderContent } from "../content/folder-content";
import { TextContent } from "../content/text-content";
import { WhiteboardExcalidraw } from "../desktop/whiteboard-excalidraw";
import { DevTools } from "./dev-tools/dev-tools";

interface AppWrapperProps {
  appType: ApplicationType;
  title: string;
  content: any;
}

export function formatWindowTitle(appType: ApplicationType, title: string) {
  switch (appType) {
    case ApplicationType.FOLDER:
      return `${title} - File Explorer`;
    case ApplicationType.DEVTOOLS:
      return `${title} - Developer Tools`;
    default:
      return title;
  }
}

export function getWindowIcon(appType: ApplicationType) {
  return ApplicationMap[appType].icon;
}

export function AppWrapper({ appType, title, content }: AppWrapperProps) {
  const renderContent = () => {
    switch (appType) {
      case ApplicationType.FOLDER:
        return <FolderContent items={content?.items || []} />;
      case ApplicationType.TEXT:
        return <TextContent content={content} />;
      case ApplicationType.WHITEBOARD:
        return <WhiteboardExcalidraw content={content} />;
      case ApplicationType.DEVTOOLS:
        return <DevTools />;
      default:
        return <div className="p-4">{content}</div>;
    }
  };

  return <div className="h-full flex flex-col">{renderContent()}</div>;
}
