"use client";

import { useState, useEffect } from "react";
import { playSound, stopSound } from "@/utils/sound-utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isVisible, setIsVisible] = useState(false);

  // Enhanced sci-fi reveal animation variants
  const containerVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
        staggerChildren: 0.1,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const frameVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Scan line effect variants
  const scanLineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 0.3,
        delay: 0.4,
      },
    },
  };

  // Turn on effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      playSound("powerOn");
      playSound("hum");
    }, 500);

    return () => {
      clearTimeout(timer);
      stopSound("hum");
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBooting) return;

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        playSound("beep");
        setSelectedIndex((prev) => {
          if (e.key === "ArrowUp") {
            return prev > 0 ? prev - 1 : prev;
          } else {
            return prev < kernelVersions.length - 1 ? prev + 1 : prev;
          }
        });
      } else if (e.key === "Enter") {
        playSound("diskDrive");
        setIsBooting(true);
        setTimeout(() => {
          stopSound("hum");
          onSelect(kernelVersions[selectedIndex].id);
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, onSelect, isBooting]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-pixel">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="w-full max-w-3xl relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Frame with glow effect */}
            <motion.div
              variants={frameVariants}
              className="absolute inset-0 border-2 border-cyan-500/30 rounded-lg"
              style={{
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                transform: "scale(1.02)",
              }}
            />

            {/* Main content container */}
            <motion.div
              className="border border-white/70 rounded-lg bg-black/95 backdrop-blur-sm overflow-hidden relative"
              variants={frameVariants}
            >
              {/* Scan line effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"
                variants={scanLineVariants}
                style={{ backgroundSize: "100% 3px" }}
              />

              {/* Content */}
              <motion.div
                className="p-4 text-white space-y-0.5 relative z-10"
                variants={contentVariants}
              >
                <div className="mb-4 text-cyan-400">GRUB Loading stage2..</div>

                {kernelVersions.map((version, index) => (
                  <motion.div
                    key={index}
                    className={`pl-2 ${
                      selectedIndex === index
                        ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-500"
                        : ""
                    }`}
                    variants={{
                      hidden: { x: -20, opacity: 0 },
                      visible: {
                        x: 0,
                        opacity: 1,
                        transition: { delay: 0.6 + index * 0.1 },
                      },
                    }}
                  >
                    {version.name}
                  </motion.div>
                ))}

                {isBooting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-cyan-500"
                  >
                    Booting {kernelVersions[selectedIndex].name}...
                  </motion.div>
                )}

                <div className="h-32" />

                {/* Instructions */}
                <motion.div
                  className="text-sm space-y-1 text-cyan-300/70"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 1 },
                    },
                  }}
                >
                  <p>
                    Use the ↑ and ↓ keys to select which entry is highlighted.
                  </p>
                  <p>Press enter to boot the selected OS.</p>
                  <p>The selected OS will boot automatically in 30 seconds.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
