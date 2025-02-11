import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/layout/root-layout";
import HomePage from "@/pages/desktop";
import NotFound from "@/pages/not-found";
import AboutPage from "@/pages/about";
import ProjectsPage from "@/pages/projects";
import PlaygroundPage from "@/pages/playground";
import WorkPage from "@/pages/work";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "playground",
        element: <PlaygroundPage />,
      },
      {
        path: "work",
        element: <WorkPage />,
      },
    ],
  },
]);

// We can keep the AppRoutes component for reference or remove it
// export function AppRoutes() {
//   return (
//     <RouterProvider router={router} />
//   );
// }
