"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CmdkLauncher() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] rounded-lg border shadow-md bg-white dark:bg-gray-800"
    >
      <Command.Input
        placeholder="Type a command or search..."
        className="w-full px-4 py-3 border-b outline-none"
      />

      <Command.List className="max-h-[300px] overflow-y-auto p-2">
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group
          heading="Navigation"
          className="px-2 py-1 text-sm text-gray-500"
        >
          <Command.Item
            onSelect={() => runCommand(() => navigate("/about"))}
            className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            About Sudeep
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => navigate("/projects"))}
            className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Projects
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => navigate("/playground"))}
            className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Playground
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => navigate("/work"))}
            className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Work
          </Command.Item>
        </Command.Group>

        <Command.Group
          heading="Theme"
          className="px-2 py-1 text-sm text-gray-500"
        >
          <Command.Item
            onSelect={() =>
              runCommand(() =>
                document.documentElement.classList.remove("dark")
              )
            }
            className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Light Theme
          </Command.Item>
          <Command.Item
            onSelect={() =>
              runCommand(() => document.documentElement.classList.add("dark"))
            }
            className="px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Dark Theme
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
