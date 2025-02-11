import {
  ApplicationType,
  ApplicationMap,
  getApplicationForFile,
} from "../../types/applications";
import { FileExplorer } from "./file-explorer/file-explorer";
import { TextEditor } from "./text-editor/text-editor";
import { WhiteboardViewer } from "./whiteboard/whiteboard-viewer";

interface AppWrapperProps {
  appType: ApplicationType;
  title: string;
  content: any;
}

export function formatWindowTitle(appType: ApplicationType, title: string) {
  const app = ApplicationMap[appType];
  return `${title} - ${app.title}`;
}

export function getWindowIcon(appType: ApplicationType) {
  return ApplicationMap[appType].icon;
}

export function AppWrapper({ appType, title, content }: AppWrapperProps) {
  const renderContent = () => {
    switch (appType) {
      case "fileExplorer":
        return <FileExplorer path={content.path} items={content.items} />;
      case "textEditor":
        return (
          <TextEditor
            filename={title}
            content={content.text}
            onSave={content.onSave}
          />
        );
      case "whiteboard":
        return <WhiteboardViewer filename={title} content={content.data} />;
      // Add other application types here as we implement them
      default:
        return <div className="p-4">{content}</div>;
    }
  };

  return <div className="h-full flex flex-col">{renderContent()}</div>;
}
