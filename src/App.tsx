import { useState } from "react";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/providers/app-provider";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";

import CustomCursor, {
  type CursorState,
} from "@/components/cursor/custom-cursor";
import { BootSequence } from "./components/boot/boot-sequence";

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("default");

  if (!isBooted) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <CustomCursor cursorState={cursorState} />
        <BootSequence onComplete={() => setIsBooted(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CustomCursor cursorState={cursorState} />
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  );
}
