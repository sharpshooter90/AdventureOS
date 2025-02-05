import { useState, useEffect } from "react";
import { BiosPost } from "./bios-post";
import { OSSelector } from "./os-selector";

type BootStage = "bios" | "os-selection" | "booting" | "complete";

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [bootStage, setBootStage] = useState<BootStage>("bios");

  if (bootStage === "bios") {
    return <BiosPost onComplete={() => setBootStage("os-selection")} />;
  }

  if (bootStage === "os-selection") {
    return (
      <OSSelector
        onSelect={() => {
          setBootStage("complete");
          onComplete();
        }}
      />
    );
  }

  return null;
}
