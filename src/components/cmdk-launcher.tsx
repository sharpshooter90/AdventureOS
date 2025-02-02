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

export function CmdkLauncher() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

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
            onSelect={() =>
              runCommand(() =>
                document.documentElement.classList.remove("dark")
              )
            }
          >
            <SunIcon className="mr-2 h-4 w-4" />
            Light Theme
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => document.documentElement.classList.add("dark"))
            }
          >
            <MoonIcon className="mr-2 h-4 w-4" />
            Dark Theme
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                if (document.documentElement.classList.contains("dark")) {
                  document.documentElement.classList.remove("dark");
                } else {
                  document.documentElement.classList.add("dark");
                }
              });
            }}
          >
            <LaptopIcon className="mr-2 h-4 w-4" />
            System Theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
