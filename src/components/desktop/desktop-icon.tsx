import React, { useState } from "react";
import { soundManager } from "../dialog/sound-manager";
import { useNavigate } from "react-router-dom";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

interface Position {
  x: number;
  y: number;
}

interface DesktopIconProps {
  icon: string;
  label: string;
  type: "file" | "folder";
  to?: string;
  onDoubleClick?: () => void;
  defaultPosition?: Position;
  onPositionChange?: (position: Position) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon,
  label,
  type,
  to,
  onDoubleClick,
  defaultPosition = { x: 0, y: 0 },
  onPositionChange,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      setIsSelected(true);
      soundManager.play("select");
    }
  };

  const handleDoubleClick = () => {
    soundManager.play("actionClick");
    if (type === "folder" && to) {
      navigate(to);
    } else if (onDoubleClick) {
      onDoubleClick();
    }
  };

  const handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(true);
    setIsSelected(true);
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    // Optional: Add any during-drag behavior here
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false);

    // Round the position to the nearest grid cell if needed
    const position = {
      x: Math.round(data.x),
      y: Math.round(data.y),
    };

    onPositionChange?.(position);

    // Prevent click event from firing after drag
    if (e.type === "mouseup") {
      (e as React.MouseEvent).stopPropagation();
    }
  };

  // Handle clicking outside to deselect
  const handleWindowClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(`[data-icon="${label}"]`)) {
      setIsSelected(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <Draggable
      defaultPosition={defaultPosition}
      bounds="parent"
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      grid={[1, 1]} // Remove grid snapping for smoother movement
    >
      <div
        data-icon={label}
        className={`absolute flex flex-col items-center gap-2 p-2 rounded cursor-pointer
          ${isSelected ? "bg-white/20" : "hover:bg-white/5"}
          transition-colors duration-200
          ${isDragging ? "z-50" : "z-0"}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-16 h-16 flex items-center justify-center">
          <span className="text-4xl">{icon}</span>
        </div>
        <span
          className={`font-pixel text-sm text-center px-1 select-none
            ${isSelected ? "bg-[#000080]" : ""}`}
        >
          {label}
        </span>
      </div>
    </Draggable>
  );
};
