import { createContext, useContext, useReducer, ReactNode } from "react";
import { RetroWindow } from "./retro-window";
import { Taskbar } from "./taskbar";
import {
  ApplicationType,
  ApplicationMap,
  getApplicationForFile,
} from "../../types/applications";
import { AppWrapper, formatWindowTitle } from "../applications/app-wrapper";

type WindowState = {
  id: string;
  title: string;
  appType: ApplicationType;
  content: any;
  isMinimized: boolean;
  isMaximized: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex: number;
};

type WindowManagerState = {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  highestZIndex: number;
  lastPosition: { x: number; y: number };
};

type WindowManagerAction =
  | {
      type: "OPEN_WINDOW";
      payload: {
        id: string;
        title: string;
        appType: ApplicationType;
        content: any;
      };
    }
  | { type: "CLOSE_WINDOW"; payload: { id: string } }
  | { type: "MINIMIZE_WINDOW"; payload: { id: string } }
  | { type: "MAXIMIZE_WINDOW"; payload: { id: string } }
  | { type: "RESTORE_WINDOW"; payload: { id: string } }
  | { type: "FOCUS_WINDOW"; payload: { id: string } }
  | {
      type: "UPDATE_POSITION";
      payload: { id: string; position: { x: number; y: number } };
    }
  | {
      type: "UPDATE_SIZE";
      payload: { id: string; size: { width: number; height: number } };
    };

const initialState: WindowManagerState = {
  windows: {},
  activeWindowId: null,
  highestZIndex: 0,
  lastPosition: { x: 50, y: 50 },
};

function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction
): WindowManagerState {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const appInfo = ApplicationMap[action.payload.appType];
      const newPosition = {
        x: state.lastPosition.x + 30,
        y: state.lastPosition.y + 30,
      };

      // Reset position if window would go off screen
      if (newPosition.x > window.innerWidth - 400) {
        newPosition.x = 50;
      }
      if (newPosition.y > window.innerHeight - 300) {
        newPosition.y = 50;
      }

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            id: action.payload.id,
            title: action.payload.title,
            appType: action.payload.appType,
            content: action.payload.content,
            isMinimized: false,
            isMaximized: false,
            position: newPosition,
            size: appInfo.defaultSize,
            zIndex: state.highestZIndex + 1,
          },
        },
        activeWindowId: action.payload.id,
        highestZIndex: state.highestZIndex + 1,
        lastPosition: newPosition,
      };
    }

    case "CLOSE_WINDOW": {
      const { [action.payload.id]: _, ...remainingWindows } = state.windows;
      return {
        ...state,
        windows: remainingWindows,
        activeWindowId:
          state.activeWindowId === action.payload.id
            ? null
            : state.activeWindowId,
      };
    }

    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            ...state.windows[action.payload.id],
            isMinimized: true,
            isMaximized: false,
          },
        },
      };

    case "MAXIMIZE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            ...state.windows[action.payload.id],
            isMaximized: true,
            isMinimized: false,
          },
        },
      };

    case "RESTORE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            ...state.windows[action.payload.id],
            isMaximized: false,
            isMinimized: false,
          },
        },
      };

    case "FOCUS_WINDOW": {
      const window = state.windows[action.payload.id];
      if (!window) return state;

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            ...window,
            zIndex: state.highestZIndex + 1,
          },
        },
        activeWindowId: action.payload.id,
        highestZIndex: state.highestZIndex + 1,
        lastPosition: window.position || state.lastPosition,
      };
    }

    case "UPDATE_POSITION":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            ...state.windows[action.payload.id],
            position: action.payload.position,
          },
        },
      };

    case "UPDATE_SIZE":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.payload.id]: {
            ...state.windows[action.payload.id],
            size: action.payload.size,
          },
        },
      };

    default:
      return state;
  }
}

const WindowManagerContext = createContext<{
  state: WindowManagerState;
  dispatch: React.Dispatch<WindowManagerAction>;
} | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialState);

  return (
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      <div className="fixed inset-0 overflow-hidden">
        {children}
        {Object.values(state.windows).map((window) => (
          <RetroWindow
            key={window.id}
            window={{
              ...window,
              title: formatWindowTitle(window.appType, window.title),
              content: (
                <AppWrapper
                  appType={window.appType}
                  title={window.title}
                  content={window.content}
                />
              ),
            }}
            isActive={state.activeWindowId === window.id}
          />
        ))}
        <Taskbar />
      </div>
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within a WindowManagerProvider"
    );
  }
  return context;
}
