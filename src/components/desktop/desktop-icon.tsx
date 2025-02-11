import { useState } from "react";
import { soundManager } from "../dialog/sound-manager";

interface DesktopIconProps {
  icon: string;
  label: string;
  onDoubleClick: () => void;
}

export function DesktopIcon({ icon, label, onDoubleClick }: DesktopIconProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    soundManager.play("select");
    setTimeout(() => setIsClicked(false), 200);
  };

  const handleDoubleClick = () => {
    soundManager.play("actionClick");
    onDoubleClick();
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 p-2 rounded cursor-pointer
        ${isClicked ? "bg-white/10" : "hover:bg-white/5"}
        transition-colors duration-200`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <span className="text-4xl">{icon}</span>
      </div>
      <span className="text-white font-pixel text-sm text-center px-1 select-none">
        {label}
      </span>
    </div>
  );
}
