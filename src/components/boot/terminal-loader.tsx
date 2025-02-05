import { useState, useEffect } from "react";

const loadingMessages = [
  "Initializing system...",
  "Loading kernel...",
  "Checking hardware compatibility...",
  "Loading system files...",
  "Mounting file systems...",
  "Starting system services...",
];

interface TerminalLoaderProps {
  stage: "initializing" | "loading";
}

export function TerminalLoader({ stage }: TerminalLoaderProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < loadingMessages.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, loadingMessages[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="bg-black min-h-screen text-green-500 p-4 font-mono">
      <div className="max-w-2xl mx-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <span className="text-green-300">root@system</span>
            <span className="text-white">:</span>
            <span className="text-blue-300">~</span>
            <span className="text-white">$ </span>
            {message}
          </div>
        ))}
        {currentIndex < loadingMessages.length && (
          <div className="animate-pulse">_</div>
        )}
      </div>
    </div>
  );
}
