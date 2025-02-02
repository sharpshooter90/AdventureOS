"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function CmdkLauncher() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "u" && (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const setThemeAndAttribute = (theme: string) => {
    setTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} showClose={false}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/about"))}>
            About Sudeep
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
            Projects
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/playground"))}
          >
            Playground
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/work"))}>
            Work
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() => runCommand(() => setThemeAndAttribute("light"))}
          >
            <SunIcon className="mr-2 h-4 w-4" />
            Light Theme
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => setThemeAndAttribute("dark"))}
          >
            <MoonIcon className="mr-2 h-4 w-4" />
            Dark Theme
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                const systemTheme = window.matchMedia(
                  "(prefers-color-scheme: dark)"
                ).matches
                  ? "dark"
                  : "light";
                setThemeAndAttribute(systemTheme);
              })
            }
          >
            <LaptopIcon className="mr-2 h-4 w-4" />
            System Theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
