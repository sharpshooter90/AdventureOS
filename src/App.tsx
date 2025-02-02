import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/providers/app-provider";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  );
}
