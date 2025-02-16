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
    grid?: {
      gridColumn?: string;
      gridRow?: string;
    };
  };
  isActive: boolean;
  className?: string;
  style?: React.CSSProperties;
  onResizeStart?: (edge: "left" | "right" | "top" | "bottom") => void;
  onResize?: (
    size: { width: number; height: number },
    position: { x: number; y: number }
  ) => void;
  onResizeEnd?: (
    size: { width: number; height: number },
    position: { x: number; y: number }
  ) => void;
}

export function RetroWindow({
  window,
  isActive,
  className = "",
  style = {},
  onResizeStart,
  onResize,
  onResizeEnd,
}: RetroWindowProps) {
  const { dispatch } = useWindowManager();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<string | null>(null);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [wasMinimized, setWasMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Track minimized state changes
  useEffect(() => {
    if (window.isMinimized) {
      setWasMinimized(true);
      setIsAnimating(false);
    }
  }, [window.isMinimized]);

  // Reset wasMinimized after animation completes
  const handleAnimationEnd = () => {
    if (wasMinimized) {
      setWasMinimized(false);
      setIsAnimating(true);
    }
  };

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

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      dispatch({
        type: "UPDATE_POSITION",
        payload: {
          id: window.id,
          position: newPosition,
        },
      });
    }

    if (isResizing && resizeEdge) {
      e.preventDefault();
      const deltaX = e.clientX - initialPosition.x;
      const deltaY = e.clientY - initialPosition.y;
      const currentPosition = window.position || { x: 0, y: 0 };
      const currentSize = window.size || { width: 400, height: 300 };

      let newWidth = currentSize.width;
      let newHeight = currentSize.height;
      let newX = currentPosition.x;
      let newY = currentPosition.y;

      // Handle resizing based on the edge being dragged
      switch (resizeEdge) {
        case "right":
          newWidth = Math.max(200, initialSize.width + deltaX);
          break;
        case "left":
          const widthChange = Math.min(deltaX, initialSize.width - 200);
          newWidth = Math.max(200, initialSize.width - deltaX);
          newX = initialPosition.x + widthChange;
          break;
        case "bottom":
          newHeight = Math.max(200, initialSize.height + deltaY);
          break;
        case "top":
          const heightChange = Math.min(deltaY, initialSize.height - 200);
          newHeight = Math.max(200, initialSize.height - deltaY);
          newY = initialPosition.y + heightChange;
          break;
      }

      onResize?.({ width: newWidth, height: newHeight }, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isResizing) {
      const finalSize = {
        width: window.size?.width ?? 0,
        height: window.size?.height ?? 0,
      };
      const finalPosition = {
        x: window.position?.x ?? 0,
        y: window.position?.y ?? 0,
      };
      onResizeEnd?.(finalSize, finalPosition);
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeEdge(null);
  };

  const startResize = (
    edge: "left" | "right" | "top" | "bottom",
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeEdge(edge);
    setInitialPosition({ x: e.clientX, y: e.clientY });
    setInitialSize({
      width: window.size?.width ?? 0,
      height: window.size?.height ?? 0,
    });
    onResizeStart?.(edge);
  };

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, dispatch]);

  useEffect(() => {
    globalThis.addEventListener("mousemove", handleMouseMove);
    globalThis.addEventListener("mouseup", handleMouseUp);
    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, initialPosition, initialSize, resizeEdge]);

  if (window.isMinimized) {
    return null;
  }

  const windowStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: window.zIndex,
    minHeight: "200px",
    minWidth: "300px",
    ...(window.isMaximized
      ? { left: 0, top: 0, right: 0, bottom: 0 }
      : {
          left: window.position?.x ?? "50%",
          top: window.position?.y ?? "50%",
          transform: window.position ? "none" : "translate(-50%, -50%)",
          width: window.size?.width ?? "800px",
          height: window.size?.height ?? "500px",
        }),
    cursor: isResizing ? `${resizeEdge}-resize` : "default",
    ...style,
  };

  return (
    <div
      ref={windowRef}
      className={`retro-window ${
        wasMinimized
          ? "window-enter from-minimized"
          : isAnimating
          ? ""
          : "window-enter"
      } ${className}`}
      style={windowStyle}
      onAnimationEnd={handleAnimationEnd}
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
        <div className="flex-1 bg-white text-black overflow-auto">
          {window.content}
        </div>

        {/* Resize handles */}
        {!window.isMaximized && (
          <>
            <div
              className="absolute top-0 left-0 w-2 h-full cursor-w-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("left", e)}
            />
            <div
              className="absolute top-0 right-0 w-2 h-full cursor-e-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("right", e)}
            />
            <div
              className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("bottom", e)}
            />
            <div
              className="absolute top-0 left-0 w-full h-2 cursor-n-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("top", e)}
            />
            {/* Corner resize handles */}
            <div
              className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("left", e)}
            />
            <div
              className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("right", e)}
            />
            <div
              className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("left", e)}
            />
            <div
              className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize hover:bg-blue-500/20"
              onMouseDown={(e) => startResize("right", e)}
            />
          </>
        )}
      </div>
    </div>
  );
}
