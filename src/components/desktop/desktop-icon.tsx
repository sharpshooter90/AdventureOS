import { useState } from "react";
import { soundManager } from "../dialog/sound-manager";
import { useNavigate } from "react-router-dom";
import React from "react";

interface DesktopIconProps {
  icon: string;
  label: string;
  type: "file" | "folder";
  to?: string;
  onDoubleClick?: () => void;
}

export function DesktopIcon({
  icon,
  label,
  type,
  to,
  onDoubleClick,
}: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsSelected(true);
    soundManager.play("select");
  };

  const handleDoubleClick = () => {
    soundManager.play("actionClick");
    if (type === "folder" && to) {
      navigate(to);
    } else if (onDoubleClick) {
      onDoubleClick();
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
    <div
      data-icon={label}
      className={`flex flex-col items-center gap-2 p-2 rounded cursor-pointer
        ${isSelected ? "bg-white/20" : "hover:bg-white/5"}
        transition-colors duration-200`}
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
  );
}
