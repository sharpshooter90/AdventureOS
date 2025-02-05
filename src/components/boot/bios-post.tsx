"use client";

import { useState, useEffect, useRef } from "react";

// Add loading spinners array
const loadingSpinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// Alternative ASCII spinners if you prefer
const asciiSpinners = ["-", "\\", "|", "/"];

// Loading states for different sections
const loadingStates = [
  "Reading",
  "Loading",
  "Verifying",
  "Checking",
  "Scanning",
];

// Function to get random loading message
const getLoadingMessage = () => {
  const state = loadingStates[Math.floor(Math.random() * loadingStates.length)];
  return `${state}...`;
};

const biosLines = [
  "Designer BIOS v1.0",
  "Copyright (C) 2024, Your Name",
  "",
  "Initializing Creative Modules...",
  "Loading Graphic Design Skills... [OK]",
  "Loading UI/UX Expertise... [OK]",
  "Loading Frontend Development... [OK]",
  "Loading Creative Problem Solving... [OK]",
  "Loading Design Systems... [OK]",
  "Loading Accessibility Standards... [OK]",
  "Loading Motion Design... [OK]",
  "Loading Design Tools... [OK]",
  "",
  "Checking System Components...",
  "CPU: Creative Processing Unit @ 4.2 GHz",
  "RAM: 64GB Design Memory Installed",
  "GPU: RTX 4090 Design Accelerator",
  "Storage: 2TB Portfolio Drive",
  "",
  "BIOS Date: 01/01/2024 Ver: 1.0.0",
  "",
  "=== Professional Profile ===",
  "Name: Your Name",
  "Title: Senior Creative Developer",
  "Location: City, Country",
  "Email: your.email@example.com",
  "",
  "=== Technical Expertise ===",
  "Frontend: React, Vue, Angular",
  "Backend: Node.js, Python, Go",
  "Design: Figma, Adobe CC, Sketch",
  "Architecture: Microservices, AWS",
  "",
  "=== Work Experience ===",
  "2022-Present: Senior Developer at TechCorp",
  "2020-2022: Full Stack Developer at StartupX",
  "2018-2020: UI/UX Designer at DesignStudio",
  "",
  "=== Education ===",
  "2018: BS Computer Science",
  "2016: Associate's in Digital Design",
  "",
  "=== Achievements ===",
  "- Best Design Award 2023",
  "- 5+ Open Source Contributions",
  "- Speaker at DesignCon 2022",
  "",
  "=== Writing & Publications ===",
  "- Tech Blog: blog.yourname.dev",
  "- Medium: @yourhandle",
  "- Dev.to: @yourname",
  "",
  "Press SPACE to enter PORTFOLIO",
];

const projectDevices = [
  "Scanning for completed projects...",
  "",
  "=== Featured Projects ===",
  "Project 1: E-commerce Website Redesign",
  "- React, Next.js, Tailwind CSS",
  "- 40% increase in conversion rate",
  "",
  "Project 2: Mobile App UI for Fitness Tracker",
  "- React Native, TypeScript",
  "- 100k+ downloads on App Store",
  "",
  "Project 3: Brand Identity for Tech Startup",
  "- Adobe CC, Figma",
  "- Featured in Design Weekly",
  "",
  "=== Open Source ===",
  "- React Component Library",
  "- VS Code Theme",
  "- Design System Generator",
  "",
  "=== Archives ===",
  "2023/",
  "├── Q4_Projects/",
  "├── Q3_Projects/",
  "├── Q2_Projects/",
  "└── Q1_Projects/",
  "",
  "2022/",
  "├── Client_Work/",
  "├── Personal_Projects/",
  "└── Experiments/",
];

// Add this CSS class to hide scrollbar but keep scroll functionality
const scrollbarHideClass = `
  overflow-y-auto 
  scrollbar-hide 
  [&::-webkit-scrollbar]:hidden 
  [-ms-overflow-style:'none'] 
  [scrollbar-width:'none']
`;

export default function DesignerBiosPost() {
  const [currentLine, setCurrentLine] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [projectLine, setProjectLine] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(getLoadingMessage());

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentLine, projectLine]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentLine < biosLines.length - 1) {
        setCurrentLine((prev) => prev + 1);
      } else if (!showProjects) {
        setShowProjects(true);
      } else if (projectLine < projectDevices.length - 1) {
        setProjectLine((prev) => prev + 1);
      } else {
        clearInterval(timer);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [currentLine, showProjects, projectLine]);

  // Spinner animation effect
  useEffect(() => {
    const spinnerTimer = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % loadingSpinners.length);
    }, 100);

    return () => clearInterval(spinnerTimer);
  }, []);

  // Loading message change effect
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setLoadingMessage(getLoadingMessage());
    }, 2000);

    return () => clearInterval(messageTimer);
  }, []);

  // Render function for lines with loading animation
  const renderLine = (line: string, index: number) => {
    const isLastLine = index === currentLine;
    const isSection = line.startsWith("===");
    const showLoading = isLastLine && !line.includes("Press SPACE");

    return (
      <div
        key={index}
        className={`${
          isSection ? "text-yellow-400 mt-2" : ""
        } flex justify-between items-center w-full`}
      >
        <div className="flex-1 whitespace-pre">{line}</div>
        {showLoading && (
          <div className="text-cyan-400 ml-4 flex-shrink-0">
            {loadingMessage} {loadingSpinners[spinnerIndex]}
          </div>
        )}
      </div>
    );
  };

  // Project line render function
  const renderProjectLine = (line: string, index: number) => {
    const isSection = line.startsWith("===");
    const showLoading = index === projectLine && !line.startsWith("===");

    return (
      <div
        key={index}
        className={`${
          line.startsWith("===")
            ? "text-yellow-400 mt-2"
            : line.startsWith("-")
            ? "text-blue-400 ml-2"
            : line.startsWith("├") || line.startsWith("└")
            ? "text-cyan-400"
            : ""
        } flex justify-between items-center w-full`}
      >
        <div className="flex-1 whitespace-pre">{line}</div>
        {showLoading && (
          <div className="text-cyan-400 ml-4 flex-shrink-0">
            {loadingMessage} {loadingSpinners[spinnerIndex]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen">
      <div
        ref={scrollRef}
        className={`font-mono text-green-400 text-sm leading-tight p-4 h-screen ${scrollbarHideClass}`}
      >
        {biosLines.slice(0, currentLine + 1).map(renderLine)}
        {showProjects && (
          <div className="mt-4">
            {projectDevices.slice(0, projectLine + 1).map(renderProjectLine)}
          </div>
        )}
      </div>
    </div>
  );
}

interface BiosPostProps {
  onComplete: () => void;
}

export function BiosPost({ onComplete }: BiosPostProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [showProjects, setShowProjects] = useState(false);
  const [projectLine, setProjectLine] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [spinnerIndex, setSpinnerIndex] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(getLoadingMessage());

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentLine, projectLine]); // Scroll when new lines are added

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentLine < biosLines.length - 1) {
        setCurrentLine((prev) => prev + 1);
      } else if (!showProjects) {
        setShowProjects(true);
      } else if (projectLine < projectDevices.length - 1) {
        setProjectLine((prev) => prev + 1);
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 1000);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [currentLine, showProjects, projectLine, onComplete]);

  // Spinner animation effect
  useEffect(() => {
    const spinnerTimer = setInterval(() => {
      setSpinnerIndex((prev) => (prev + 1) % loadingSpinners.length);
    }, 100);

    return () => clearInterval(spinnerTimer);
  }, []);

  // Loading message change effect
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setLoadingMessage(getLoadingMessage());
    }, 2000);

    return () => clearInterval(messageTimer);
  }, []);

  // Render function for lines with loading animation
  const renderLine = (line: string, index: number) => {
    const isLastLine = index === currentLine;
    const isSection = line.startsWith("===");
    const showLoading = isLastLine && !line.includes("Press SPACE");

    return (
      <div
        key={index}
        className={`${
          isSection ? "text-yellow-400 mt-2" : ""
        } flex justify-between items-center w-full`}
      >
        <div className="flex-1 whitespace-pre">{line}</div>
        {showLoading && (
          <div className="text-cyan-400 ml-4 flex-shrink-0">
            {loadingMessage} {loadingSpinners[spinnerIndex]}
          </div>
        )}
      </div>
    );
  };

  // Project line render function
  const renderProjectLine = (line: string, index: number) => {
    const isSection = line.startsWith("===");
    const showLoading = index === projectLine && !line.startsWith("===");

    return (
      <div
        key={index}
        className={`${
          line.startsWith("===")
            ? "text-yellow-400 mt-2"
            : line.startsWith("-")
            ? "text-blue-400 ml-2"
            : line.startsWith("├") || line.startsWith("└")
            ? "text-cyan-400"
            : ""
        } flex justify-between items-center w-full`}
      >
        <div className="flex-1 whitespace-pre">{line}</div>
        {showLoading && (
          <div className="text-cyan-400 ml-4 flex-shrink-0">
            {loadingMessage} {loadingSpinners[spinnerIndex]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen">
      <div
        ref={scrollRef}
        className={`font-mono text-green-400 text-sm leading-tight p-4 h-screen ${scrollbarHideClass}`}
      >
        {biosLines.slice(0, currentLine + 1).map(renderLine)}
        {showProjects && (
          <div className="mt-4">
            {projectDevices.slice(0, projectLine + 1).map(renderProjectLine)}
          </div>
        )}
      </div>
    </div>
  );
}
