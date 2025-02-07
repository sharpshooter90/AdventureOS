"use client";

import React, { useEffect, useRef, useCallback } from "react";
import "./cursor.css";

export type CursorState =
  | "default"
  | "hover"
  | "clicking"
  | "text"
  | "ew-resize"
  | "ns-resize";

interface CustomCursorProps {
  cursorState?: CursorState;
}

const CustomCursor: React.FC<CustomCursorProps> = React.memo(
  ({ cursorState = "default" }) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef({ x: 0, y: 0 });
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();

    const animateCursor = useCallback((time: number) => {
      if (previousTimeRef.current !== undefined) {
        const { x, y } = positionRef.current;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animateCursor);
    }, []);

    useEffect(() => {
      const moveCursor = (e: MouseEvent) => {
        positionRef.current = { x: e.clientX, y: e.clientY };
      };

      const debouncedMoveCursor = debounce(moveCursor, 5);

      document.addEventListener("mousemove", debouncedMoveCursor);
      requestRef.current = requestAnimationFrame(animateCursor);

      return () => {
        document.removeEventListener("mousemove", debouncedMoveCursor);
        cancelAnimationFrame(requestRef.current!);
      };
    }, [animateCursor]);

    return <div ref={cursorRef} className={`custom-cursor ${cursorState}`} />;
  }
);

CustomCursor.displayName = "CustomCursor";

// Debounce function
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default CustomCursor;
