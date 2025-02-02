import "./App.css";
import { AppRoutes } from "./routes";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  // Set initial theme
  const initialTheme = localStorage.getItem("vite-ui-theme") || "dark";
  document.documentElement.setAttribute("data-theme", initialTheme);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
