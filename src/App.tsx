import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/providers/app-provider";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { BootSequence } from "./components/boot/boot-sequence";
import { useState } from "react";

export default function App() {
  const [isBooted, setIsBooted] = useState(false);

  if (!isBooted) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BootSequence onComplete={() => setIsBooted(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  );
}
