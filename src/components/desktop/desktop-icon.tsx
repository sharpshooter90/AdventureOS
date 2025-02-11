import React, { useRef, useState, useEffect } from "react";
import { soundManager } from "../dialog/sound-manager";
import { useNavigate } from "react-router-dom";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import {
  FolderIcon,
  FileIcon,
  TextFileIcon,
  ImageFileIcon,
  ComputerIcon,
  RecycleBinIcon,
} from "../icons/pixel-icons";

interface Position {
  x: number;
  y: number;
}

interface DesktopIconProps {
  id: string;
  label: string;
  type: "folder" | "file" | "text" | "image" | "computer" | "recyclebin";
  defaultPosition?: { x: number; y: number };
  onDoubleClick?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  icon?: React.ElementType | string;
}

const IconComponent = {
  folder: FolderIcon,
  file: FileIcon,
  text: TextFileIcon,
  image: ImageFileIcon,
  computer: ComputerIcon,
  recyclebin: RecycleBinIcon,
};

export function DesktopIcon({
  id,
  label,
  type,
  defaultPosition,
  onDoubleClick,
  onPositionChange,
  icon,
}: DesktopIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const [{ isDragging: dndIsDragging }, drag, preview] = useDrag(
    () => ({
      type: "desktop-icon",
      item: { id, type: "desktop-icon" },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id]
  );

  // Use empty image as drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Attach drag ref to the div directly
  useEffect(() => {
    if (iconRef.current) {
      drag(iconRef.current);
    }
  }, [drag]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      setIsSelected(true);
      soundManager.play("select");
    }
  };

  const handleDoubleClick = () => {
    soundManager.play("actionClick");
    if (onDoubleClick) {
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

    // Prevent click event from firing after drag
    if (e.type === "mouseup") {
      (e as React.MouseEvent).stopPropagation();
    }

    if (onPositionChange) {
      onPositionChange(position);
    }
  };

  // Handle clicking outside to deselect
  const handleWindowClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(`[data-icon="${label}"]`)) {
      setIsSelected(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  const Icon = IconComponent[type];

  return (
    <Draggable
      defaultPosition={defaultPosition}
      bounds="parent"
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      grid={[120, 120]}
    >
      <div
        ref={iconRef}
        data-icon={label}
        className={`absolute flex flex-col items-center gap-2 p-2 rounded cursor-pointer
          ${isSelected ? "bg-white/20" : "hover:bg-white/10"}
          transition-colors duration-200
          ${isDragging ? "z-50" : "z-0"}
          min-w-[96px] max-w-[96px]`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-20 h-20 flex items-center justify-center">
          {(() => {
            const IconComp = icon || IconComponent[type];
            return typeof IconComp === "string" ? (
              <span className="w-16 h-16 flex items-center justify-center">
                {IconComp}
              </span>
            ) : (
              React.createElement(IconComp, { className: "w-16 h-16" })
            );
          })()}
        </div>
        <span
          className={`font-pixel text-sm text-center px-1 select-none text-black break-words w-full
            ${isSelected ? "bg-[#000080] text-black" : "text-black"}`}
        >
          {label}
        </span>
      </div>
    </Draggable>
  );
}
