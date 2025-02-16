import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { RetroWindow } from "./retro-window";
import { Taskbar } from "./taskbar";
import {
  ApplicationType,
  ApplicationMap,
  getApplicationForFile,
} from "../../types/applications";
import { AppWrapper, formatWindowTitle } from "../applications/app-wrapper";
import {
  initialWindowLayouts,
  defaultGridConfig,
  GridPosition,
} from "../../config/initial-layout";
import { TileManager, TileLayout } from "./tile-manager";

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

type WindowConfig = {
  id: string;
  size?: { width: number; height: number };
  position?: { x: number; y: number };
};

type WindowManagerConfig = {
  windows: Record<string, WindowConfig>;
  tileLayout: TileLayout | null;
  tileManagerEnabled: boolean;
};

type WindowManagerState = {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  highestZIndex: number;
  bootComplete: boolean;
  tileManagerEnabled: boolean;
  tileLayout: TileLayout | null; // null means floating windows
};

type WindowManagerAction =
  | {
      type: "OPEN_WINDOW";
      payload: {
        id: string;
        title: string;
        appType: ApplicationType;
        content: any;
        position?: { x: number; y: number };
        size?: { width: number; height: number };
      };
    }
  | { type: "CLOSE_WINDOW"; payload: { id: string } }
  | { type: "MINIMIZE_WINDOW"; payload: { id: string } }
  | { type: "MAXIMIZE_WINDOW"; payload: { id: string } }
  | { type: "RESTORE_WINDOW"; payload: { id: string } }
  | { type: "FOCUS_WINDOW"; payload: { id: string } }
  | { type: "SET_TILE_LAYOUT"; payload: { layout: TileLayout | null } }
  | { type: "TOGGLE_TILE_MANAGER"; payload: { enabled: boolean } }
  | {
      type: "UPDATE_POSITION";
      payload: {
        id: string;
        position: { x: number; y: number };
      };
    }
  | {
      type: "UPDATE_SIZE";
      payload: {
        id: string;
        size: { width: number; height: number };
      };
    }
  | { type: "COMPLETE_BOOT" };

const initialState: WindowManagerState = {
  windows: {},
  activeWindowId: null,
  highestZIndex: 0,
  bootComplete: false,
  tileManagerEnabled: false,
  tileLayout: null,
};

function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction
): WindowManagerState {
  switch (action.type) {
    case "OPEN_WINDOW": {
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
            position: action.payload.position,
            size: action.payload.size,
            zIndex: state.highestZIndex + 1,
          },
        },
        activeWindowId: action.payload.id,
        highestZIndex: state.highestZIndex + 1,
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

    case "COMPLETE_BOOT":
      return {
        ...state,
        bootComplete: true,
      };

    case "TOGGLE_TILE_MANAGER":
      return {
        ...state,
        tileManagerEnabled: action.payload.enabled,
        // When disabling tile manager, clear the tile layout
        tileLayout: action.payload.enabled ? state.tileLayout : null,
      };

    case "SET_TILE_LAYOUT":
      // Only set tile layout if tile manager is enabled
      if (!state.tileManagerEnabled) return state;
      return {
        ...state,
        tileLayout: action.payload.layout,
      };

    default:
      return state;
  }
}

const WindowManagerContext = createContext<{
  state: WindowManagerState;
  dispatch: React.Dispatch<WindowManagerAction>;
} | null>(null);

const STORAGE_KEY = "window-manager-config";

function saveWindowManagerConfig(config: WindowManagerConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function loadWindowManagerConfig(): WindowManagerConfig | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse window manager config:", e);
    }
  }
  return null;
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialState);
  const [tileManager] = useState(() => new TileManager());
  const [resizingWindow, setResizingWindow] = useState<
    | {
        id: string;
        edge: "left" | "right" | "top" | "bottom";
        rect: { x: number; y: number; width: number; height: number };
      }
    | undefined
  >(undefined);

  // Load saved configuration on mount
  useEffect(() => {
    const savedConfig = loadWindowManagerConfig();
    if (savedConfig) {
      // Restore tile manager state and layout
      if (savedConfig.tileManagerEnabled !== undefined) {
        dispatch({
          type: "TOGGLE_TILE_MANAGER",
          payload: { enabled: savedConfig.tileManagerEnabled },
        });
      }
      if (savedConfig.tileLayout !== null) {
        dispatch({
          type: "SET_TILE_LAYOUT",
          payload: { layout: savedConfig.tileLayout },
        });
      }
    }
  }, []);

  // Save configuration when windows change
  useEffect(() => {
    if (state.bootComplete) {
      const config: WindowManagerConfig = {
        windows: Object.entries(state.windows).reduce((acc, [id, window]) => {
          acc[id] = {
            id,
            size: window.size,
            position: window.position,
          };
          return acc;
        }, {} as Record<string, WindowConfig>),
        tileLayout: state.tileLayout,
        tileManagerEnabled: state.tileManagerEnabled,
      };
      saveWindowManagerConfig(config);
    }
  }, [
    state.windows,
    state.tileLayout,
    state.tileManagerEnabled,
    state.bootComplete,
  ]);

  // Effect to handle window tiling
  useEffect(() => {
    if (state.tileManagerEnabled && state.tileLayout && !resizingWindow) {
      const visibleWindows = Object.values(state.windows)
        .filter((w) => !w.isMinimized)
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((w) => w.id);

      const positions = tileManager.calculateLayout(
        visibleWindows,
        state.tileLayout,
        window.innerWidth,
        window.innerHeight,
        40
      );

      // Apply positions to windows
      Object.entries(positions).forEach(([id, rect]) => {
        dispatch({
          type: "UPDATE_POSITION",
          payload: { id, position: { x: rect.x, y: rect.y } },
        });
        dispatch({
          type: "UPDATE_SIZE",
          payload: { id, size: { width: rect.width, height: rect.height } },
        });
      });
    }
  }, [
    state.tileLayout,
    Object.keys(state.windows).length,
    state.tileManagerEnabled,
  ]);

  // Handle window resize
  const handleResize = (
    windowId: string,
    newSize: { width: number; height: number },
    newPosition: { x: number; y: number }
  ) => {
    if (resizingWindow) {
      // Capture the active edge before updating state to avoid stale state issues
      const activeEdge = resizingWindow.edge;
      const updatedRect = {
        ...newPosition,
        ...newSize,
      };

      // Update the resizing window's state with the new rect
      setResizingWindow({
        ...resizingWindow,
        rect: updatedRect,
      });

      if (state.tileManagerEnabled && state.tileLayout) {
        // Calculate new positions for all windows based on the resize
        const visibleWindows = Object.values(state.windows)
          .filter((w) => !w.isMinimized)
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((w) => w.id);

        const positions = tileManager.calculateLayout(
          visibleWindows,
          state.tileLayout,
          window.innerWidth,
          window.innerHeight,
          40,
          {
            id: windowId,
            rect: updatedRect,
            resizeEdge: activeEdge,
          }
        );

        // Update all windows including the resizing one
        Object.entries(positions).forEach(([id, rect]) => {
          dispatch({
            type: "UPDATE_POSITION",
            payload: { id, position: { x: rect.x, y: rect.y } },
          });
          dispatch({
            type: "UPDATE_SIZE",
            payload: { id, size: { width: rect.width, height: rect.height } },
          });
        });
      } else {
        // In free-form mode, only update the resizing window
        dispatch({
          type: "UPDATE_SIZE",
          payload: { id: windowId, size: newSize },
        });
        dispatch({
          type: "UPDATE_POSITION",
          payload: { id: windowId, position: newPosition },
        });
      }
    }
  };

  // Handle window resize end
  const handleResizeEnd = (
    windowId: string,
    newSize: { width: number; height: number },
    newPosition: { x: number; y: number }
  ) => {
    if (state.tileManagerEnabled && state.tileLayout) {
      // Final recalculation of all window positions
      const visibleWindows = Object.values(state.windows)
        .filter((w) => !w.isMinimized)
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((w) => w.id);

      const positions = tileManager.calculateLayout(
        visibleWindows,
        state.tileLayout,
        window.innerWidth,
        window.innerHeight,
        40,
        {
          id: windowId,
          rect: {
            ...newPosition,
            ...newSize,
          },
          resizeEdge: resizingWindow?.edge,
        }
      );

      // Apply final positions to all windows
      Object.entries(positions).forEach(([id, rect]) => {
        dispatch({
          type: "UPDATE_POSITION",
          payload: { id, position: { x: rect.x, y: rect.y } },
        });
        dispatch({
          type: "UPDATE_SIZE",
          payload: { id, size: { width: rect.width, height: rect.height } },
        });
      });
    }

    setResizingWindow(undefined);
  };

  // Handle window resize start
  const handleResizeStart = (
    windowId: string,
    edge: "left" | "right" | "top" | "bottom"
  ) => {
    const window = state.windows[windowId];
    if (window) {
      setResizingWindow({
        id: windowId,
        edge,
        rect: {
          x: window.position?.x || 0,
          y: window.position?.y || 0,
          width: window.size?.width || 400,
          height: window.size?.height || 300,
        },
      });
    }
  };

  // Initial window layout effect
  useEffect(() => {
    if (!state.bootComplete) {
      const savedConfig = loadWindowManagerConfig();

      initialWindowLayouts.forEach((layout, index) => {
        setTimeout(() => {
          // Get saved window config if available
          const savedWindow = savedConfig?.windows[layout.id];

          dispatch({
            type: "OPEN_WINDOW",
            payload: {
              id: layout.id,
              title: layout.title,
              appType: layout.appType,
              content: layout.content,
              // Use saved position/size if available, otherwise use defaults
              position: savedWindow?.position,
              size: savedWindow?.size,
            },
          });

          if (index === initialWindowLayouts.length - 1) {
            dispatch({ type: "COMPLETE_BOOT" });
            // Use saved layout or default to grid
            dispatch({
              type: "SET_TILE_LAYOUT",
              payload: { layout: savedConfig?.tileLayout ?? "grid" },
            });
          }
        }, index * 300);
      });
    }
  }, []);

  // Add keyboard shortcuts for layout switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && state.tileManagerEnabled) {
        switch (e.key) {
          case "1":
            dispatch({
              type: "SET_TILE_LAYOUT",
              payload: { layout: "vertical" },
            });
            break;
          case "2":
            dispatch({
              type: "SET_TILE_LAYOUT",
              payload: { layout: "horizontal" },
            });
            break;
          case "3":
            dispatch({ type: "SET_TILE_LAYOUT", payload: { layout: "grid" } });
            break;
          case "4":
            dispatch({
              type: "SET_TILE_LAYOUT",
              payload: { layout: "masterDetail" },
            });
            break;
          case "0":
            dispatch({ type: "SET_TILE_LAYOUT", payload: { layout: null } });
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.tileManagerEnabled]);

  return (
    <WindowManagerContext.Provider value={{ state, dispatch }}>
      {/* Desktop Background */}
      <div className="fixed inset-0 bg-[#008080]">{children}</div>

      {/* Windows Layer */}
      <div className="fixed inset-0 pointer-events-none">
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
            className="pointer-events-auto"
            onResizeStart={(edge) => handleResizeStart(window.id, edge)}
            onResize={(size, position) =>
              handleResize(window.id, size, position)
            }
            onResizeEnd={(size, position) =>
              handleResizeEnd(window.id, size, position)
            }
          />
        ))}
      </div>

      <Taskbar />
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
