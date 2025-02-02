import { motion } from "framer-motion";
import { CmdkLauncher } from "@/components/cmdk-launcher";
import { NavBar } from "@/components/layout/nav-bar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <CmdkLauncher />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
