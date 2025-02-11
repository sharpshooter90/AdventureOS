import { motion } from "framer-motion";
import { CmdkLauncher } from "@/components/cmdk-launcher";
import { NavBar } from "./nav-bar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen selection:bg-cyan-300 selection:text-gray-800 dark:selection:bg-cyan-600 dark:selection:text-white dotted-grid">
      {/* <NavBar /> */}
      <CmdkLauncher />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
