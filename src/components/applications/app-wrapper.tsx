import { ApplicationType, ApplicationMap } from "../../types/applications";
import { FileExplorer } from "./file-explorer/file-explorer";
import { TextEditor } from "./text-editor/text-editor";
import { FolderContent } from "../content/folder-content";
import { TextContent } from "../content/text-content";
import { WhiteboardExcalidraw } from "../desktop/whiteboard-excalidraw";
import { DevTools } from "./dev-tools/dev-tools";
import { AudioPlayer } from "./audio-player/audio-player";
import { MultiplayerSettings } from "./multiplayer/multiplayer-settings";

interface AppWrapperProps {
  appType: ApplicationType;
  title: string;
  content: any;
}

export function formatWindowTitle(appType: ApplicationType, title: string) {
  const appInfo = ApplicationMap[appType];
  return `${appInfo.icon} ${title}`;
}

export function AppWrapper({ appType, title, content }: AppWrapperProps) {
  switch (appType) {
    case ApplicationType.FOLDER:
      return <FolderContent items={content?.items || []} />;
    case ApplicationType.TEXT:
      return <TextContent content={content?.text || ""} />;
    case ApplicationType.WHITEBOARD:
      return <WhiteboardExcalidraw />;
    case ApplicationType.DEVTOOLS:
      return <DevTools />;
    case ApplicationType.FILE_EXPLORER:
      return (
        <FileExplorer
          items={content?.items || []}
          path={content?.path || "/"}
        />
      );
    case ApplicationType.TEXT_EDITOR:
      return (
        <TextEditor
          filename={title}
          content={content?.text || ""}
          onSave={content?.onSave}
        />
      );
    case ApplicationType.MULTIPLAYER_SETTINGS:
      return <MultiplayerSettings />;
    case ApplicationType.AUDIO_PLAYER:
      return <AudioPlayer />;
    default:
      return <div>Unsupported application type: {appType}</div>;
  }
}
