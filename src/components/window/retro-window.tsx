import { useState, useRef, useEffect } from "react";
import { useWindowManager } from "./window-manager";
import { soundManager } from "../dialog/sound-manager";
import "./window.css";

interface RetroWindowProps {
  window: {
    id: string;
    title: string;
    content: React.ReactNode;
    isMinimized: boolean;
    isMaximized: boolean;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    zIndex: number;
  };
  isActive: boolean;
}

export function RetroWindow({ window, isActive }: RetroWindowProps) {
  const { dispatch } = useWindowManager();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!window.isMaximized) {
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
    dispatch({ type: "FOCUS_WINDOW", payload: { id: window.id } });
    soundManager.play("select");
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      dispatch({
        type: "UPDATE_POSITION",
        payload: {
          id: window.id,
          position: {
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
          },
        },
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, dispatch]);

  if (window.isMinimized) {
    return null;
  }

  const windowStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: window.zIndex,
    ...(window.isMaximized
      ? { left: 0, top: 0, right: 0, bottom: 0 }
      : {
          left: window.position?.x ?? "50%",
          top: window.position?.y ?? "50%",
          transform: window.position ? "none" : "translate(-50%, -50%)",
          width: window.size?.width ?? "800px",
          height: window.size?.height ?? "auto",
        }),
  };

  return (
    <div
      ref={windowRef}
      className={`relative window-enter ${
        window.isMaximized ? "w-full h-full" : "max-w-[90vw]"
      }`}
      style={windowStyle}
    >
      {/* Shadow effect */}
      <div className="absolute -right-2 -bottom-2 w-full h-full bg-black" />

      {/* Main window container */}
      <div
        className={`relative border-2 ${
          isActive ? "border-white" : "border-gray-500"
        } bg-[#000080] text-white h-full flex flex-col`}
      >
        {/* Window Header */}
        <div
          className={`dialog-header cursor-move select-none ${
            isActive ? "bg-[#000080]" : "bg-[#000060]"
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="dialog-title">{window.title}</div>
          <div className="flex gap-2">
            <button
              className="window-button"
              onClick={() => {
                dispatch({
                  type: window.isMaximized
                    ? "RESTORE_WINDOW"
                    : "MAXIMIZE_WINDOW",
                  payload: { id: window.id },
                });
                soundManager.play("actionClick");
              }}
            >
              {window.isMaximized ? "❐" : "□"}
            </button>
            <button
              className="window-button"
              onClick={() => {
                dispatch({
                  type: "MINIMIZE_WINDOW",
                  payload: { id: window.id },
                });
                soundManager.play("actionClick");
              }}
            >
              ＿
            </button>
            <button
              className="window-button text-white hover:bg-red-600"
              onClick={() => {
                dispatch({ type: "CLOSE_WINDOW", payload: { id: window.id } });
                soundManager.play("actionClick");
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="window-content">{window.content}</div>
      </div>
    </div>
  );
}
