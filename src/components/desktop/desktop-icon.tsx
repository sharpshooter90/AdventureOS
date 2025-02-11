import React, { useRef, useState, useEffect } from "react";
import { soundManager } from "../dialog/sound-manager";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import { useWindowManager } from "../window/window-manager";
import { getApplicationForFile } from "../../types/applications";
import {
  FolderIcon,
  FileIcon,
  TextFileIcon,
  ImageFileIcon,
  ComputerIcon,
  RecycleBinIcon,
} from "../icons/pixel-icons";

export interface DesktopIconProps {
  id: string;
  label: string;
  type: "folder" | "file" | "text";
  icon?: string;
  content: any;
  defaultPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onClick?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
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
  icon,
  content,
  defaultPosition,
  onPositionChange,
  onClick,
  isSelected = false,
}: DesktopIconProps) {
  const { dispatch } = useWindowManager();
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPosition(defaultPosition);
  }, [defaultPosition]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    setIsDragging(false);
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const handleDoubleClick = () => {
    const appType =
      type === "folder" ? "fileExplorer" : getApplicationForFile(label);
    const title =
      type === "folder" ? `${label} - File Explorer` : `${label} - ${appType}`;

    dispatch({
      type: "OPEN_WINDOW",
      payload: {
        id: `${type}-${id}`,
        title,
        appType,
        content: type === "folder" ? { items: content } : content,
      },
    });
  };

  return (
    <Draggable
      position={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        className={`absolute flex flex-col items-center p-2 cursor-pointer select-none ${
          isDragging ? "opacity-50" : ""
        } ${isSelected ? "bg-blue-200" : ""}`}
        onDoubleClick={handleDoubleClick}
        onClick={onClick}
      >
        <div className="text-2xl mb-1">
          {icon || (type === "folder" ? "📁" : "📄")}
        </div>
        <div className="text-sm text-center max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </div>
      </div>
    </Draggable>
  );
}
