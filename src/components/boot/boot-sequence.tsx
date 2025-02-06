import { useState, useEffect } from "react";
import { BiosPost } from "./bios-post";
import { OSSelector } from "./os-selector";
import { SplashScreen } from "./splash-screen";

type BootStage = "splash" | "bios" | "os-selection" | "booting" | "complete";

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [bootStage, setBootStage] = useState<BootStage>("splash");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check for existing email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
      setBootStage("bios");
    }
  }, []);

  if (bootStage === "splash") {
    return (
      <SplashScreen
        onVerified={(email) => {
          setUserEmail(email);
          setBootStage("bios");
        }}
      />
    );
  }

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
