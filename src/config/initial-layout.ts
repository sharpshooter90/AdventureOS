import { ApplicationType } from "../types/applications";

// Grid-based layout configuration
export interface GridPosition {
  gridColumn?: string; // e.g. "1 / 3" for spanning 2 columns
  gridRow?: string; // e.g. "1 / 3" for spanning 2 rows
}

export interface WindowLayout {
  id: string;
  title: string;
  appType: ApplicationType;
  content?: any;
  grid?: GridPosition; // Optional grid positioning
  isMinimized?: boolean;
  isMaximized?: boolean;
}

// Grid configuration
export interface GridConfig {
  columns: number;
  rows: number;
  gutter: number; // in pixels
}

export const defaultGridConfig: GridConfig = {
  columns: 4,
  rows: 4,
  gutter: 20,
};

export const initialWindowLayouts: WindowLayout[] = [
  {
    id: "second-brain",
    title: "Design Second Brain",
    appType: ApplicationType.TEXT_EDITOR,
    grid: {
      gridColumn: "1 / 3", // Spans 2 columns
      gridRow: "1 / 3", // Spans 2 rows
    },
    content: {
      type: "markdown",
      data: "# Design Second Brain\n\nWelcome to my design philosophy and process...",
    },
  },
  {
    id: "neofetch",
    title: "System Info",
    appType: ApplicationType.TERMINAL,
    grid: {
      gridColumn: "3 / 5", // Spans 2 columns
      gridRow: "1 / 2", // Spans 1 row
    },
    content: {
      type: "neofetch",
      portfolioUrl: "https://yourportfolio.com",
    },
  },
  {
    id: "skills-chart",
    title: "Skills & Expertise",
    appType: ApplicationType.WHITEBOARD,
    grid: {
      gridColumn: "3 / 5", // Spans 2 columns
      gridRow: "2 / 4", // Spans 2 rows
    },
    content: {
      type: "spider",
      skills: [
        { area: "UI Design", level: 0.9 },
        { area: "UX Research", level: 0.85 },
        { area: "Product Strategy", level: 0.8 },
        { area: "Design Systems", level: 0.95 },
        { area: "User Testing", level: 0.75 },
        { area: "Visual Design", level: 0.85 },
      ],
    },
  },
  {
    id: "projects",
    title: "Recent Projects",
    appType: ApplicationType.TEXT_EDITOR,
    grid: {
      gridColumn: "1 / 2", // Spans 1 column
      gridRow: "3 / 4", // Spans 1 row
    },
    content: {
      type: "markdown",
      data: "# Recent Projects\n\n- AdventureOS\n- Design System Framework\n- UX Research Platform",
    },
  },
  {
    id: "tools",
    title: "Design Tools",
    appType: ApplicationType.TEXT_EDITOR,
    grid: {
      gridColumn: "2 / 3", // Spans 1 column
      gridRow: "3 / 4", // Spans 1 row
    },
    content: {
      type: "markdown",
      data: "# Design Tools\n\n- Figma\n- Framer\n- Sketch\n- Adobe Creative Suite",
    },
  },
  {
    id: "process",
    title: "Design Process",
    appType: ApplicationType.WHITEBOARD,
    grid: {
      gridColumn: "1 / 3", // Spans 2 columns
      gridRow: "4 / 5", // Spans 1 row
    },
    content: {
      type: "flowchart",
      data: "Research → Ideate → Prototype → Test → Iterate",
    },
  },
];
