"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { soundManager } from "./sound-manager";
import "./retro-dialog.css";

interface BiosDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  onPlaySound: (sound: string) => void;
  children?: React.ReactNode;
}

const BiosDialog: React.FC<BiosDialogProps> = ({
  onClose,
  onConfirm,
  onPlaySound,
  children,
}) => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const menuItems = ["Yes", "No"];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setSelectedItem((prev) => {
          const newSelected = prev === 0 ? 1 : 0;
          onPlaySound("select");
          return newSelected;
        });
      } else if (e.key === "Enter") {
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPlaySound]);

  const handleButtonClick = (index: number) => {
    setSelectedItem(index);
    onPlaySound("actionClick");

    if (index === 1) {
      // No button
      closeDialog();
    } else {
      // Yes button
      handleConfirm();
    }
  };

  const closeDialog = useCallback(() => {
    setIsClosing(true);
    onPlaySound("actionClick");

    setTimeout(() => {
      onClose();
    }, 800); // Matches the animation duration
  }, [onClose, onPlaySound]);

  const handleConfirm = () => {
    if (selectedItem === 0) {
      // Yes button logic
      onPlaySound("success");
      onConfirm();
    } else {
      // No button logic
      closeDialog();
    }
  };

  return (
    <div className={`relative ${isClosing ? "modal-exit" : ""}`}>
      {/* Shadow effect for dialog */}
      <div className="absolute -right-2 -bottom-2 w-full h-full bg-black"></div>

      {/* Main menu container */}
      <div className="relative border-2 border-white bg-[#000080] text-white w-[800px] max-w-[90vw]">
        {/* Dialog Header */}
        <div className="dialog-header">
          <div className="dialog-title">About Sudeep.md</div>
          <div className="close-button" onClick={closeDialog}>
            <div className="pixel-x"></div>
          </div>
        </div>

        {/* Dialog Content */}
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}

          {/* Action buttons */}
          <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-white/20">
            {menuItems.map((item, index) => (
              <div key={item} className="relative">
                {selectedItem === index && (
                  <div className="absolute -right-1 -bottom-1 w-full h-full bg-black"></div>
                )}
                <button
                  className={`px-4 py-1 min-w-[60px] transition-all duration-100 relative ${
                    selectedItem === index
                      ? "bg-[#800080] text-white"
                      : "hover:bg-[#4040c0]"
                  }`}
                  onClick={() => handleButtonClick(index)}
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiosDialog;
