import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/playground", label: "Playground" },
  { path: "/work", label: "Work" },
];

export function NavBar() {
  const location = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className="text-xl font-bold">
              AdventureOS
            </Link>

            <div className="flex space-x-4 sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
