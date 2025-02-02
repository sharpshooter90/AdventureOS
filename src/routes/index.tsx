import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import RootLayout from "@/components/layout/root-layout";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import ProjectsPage from "@/pages/projects";
import PlaygroundPage from "@/pages/playground";
import WorkPage from "@/pages/work";

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="playground" element={<PlaygroundPage />} />
          <Route path="work" element={<WorkPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export const routes = AppRoutes;
