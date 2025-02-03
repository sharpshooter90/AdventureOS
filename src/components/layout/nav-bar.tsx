import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoExplanation } from "@/components/logo/logo-explanation";
import { AudioPlayer } from "@/components/audio/audio-player";
import { HoverAudioItem } from "@/components/hover-audio-item";
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
      <div className="flex items-center justify-center px-4">
        <div className="flex h-16 w-full max-w-[640px] items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <LogoExplanation />

            <div className="flex space-x-4 sm:space-x-8">
              {navItems.map((item) => (
                <HoverAudioItem soundUrl="/assets/sounds/explainer-hover.mp3">
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-[24px] font-pixelGeneva9 transition-colors hover:text-primary",
                      location.pathname === item.path
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </HoverAudioItem>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioPlayer />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
