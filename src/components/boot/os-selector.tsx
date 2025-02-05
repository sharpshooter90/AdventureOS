"use client";

import { useState, useEffect } from "react";

const kernelVersions = [
  {
    id: "mac-retro",
    name: "MacOS System 7",
    description: "Classic Macintosh Experience",
  },
  {
    id: "win95",
    name: "Windows 95",
    description: "Classic Windows Experience",
  },
  {
    id: "linux",
    name: "Linux 2.6.22-18-generic",
    description: "Unix-like Experience",
  },
  {
    id: "linux-recovery",
    name: "Linux 2.6.22-18-generic (recovery mode)",
    description: "Safe Mode",
  },
  {
    id: "memtest",
    name: "Memory Test (memtest86+)",
    description: "Hardware Diagnostics",
  },
];

interface OSSelectorProps {
  onSelect: (os: string) => void;
}

export function OSSelector({ onSelect }: OSSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBooting, setIsBooting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBooting) return;

      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev < kernelVersions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "Enter") {
        setIsBooting(true);
        setTimeout(() => {
          onSelect(kernelVersions[selectedIndex].id);
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, onSelect, isBooting]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-3xl border border-white rounded">
        <div className="p-4 text-white space-y-0.5">
          <div className="mb-4">GRUB Loading stage2..</div>

          {kernelVersions.map((version, index) => (
            <div
              key={index}
              className={`pl-2 ${
                selectedIndex === index ? "bg-white text-black" : ""
              }`}
            >
              {version.name}
            </div>
          ))}

          {isBooting && (
            <div className="mt-4 text-green-500">
              Booting {kernelVersions[selectedIndex].name}...
            </div>
          )}

          {/* Empty space */}
          <div className="h-32" />

          {/* Instructions */}
          <div className="text-sm space-y-1 text-gray-400">
            <p>Use the ↑ and ↓ keys to select which entry is highlighted.</p>
            <p>Press enter to boot the selected OS.</p>
            <p>The selected OS will boot automatically in 30 seconds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
