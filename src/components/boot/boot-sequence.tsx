import { useState, useEffect } from "react";
import { BiosPost } from "./bios-post";
import { OSSelector } from "./os-selector";
import { SplashScreen } from "./splash-screen";

type BootStage = "splash" | "bios" | "os-selection" | "booting" | "complete";

interface BootState {
  stage: BootStage;
  userEmail: string | null;
  selectedOS: string | null;
}

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_STATE_KEY = "adventureOS_bootState";

// Helper function to get initial boot state
const getInitialBootState = (): BootState | null => {
  try {
    const savedState = localStorage.getItem(BOOT_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error reading boot state:", error);
  }
  return null;
};

export function BootSequence({ onComplete }: BootSequenceProps) {
  const initialState = getInitialBootState();
  const [bootStage, setBootStage] = useState<BootStage>(
    initialState?.stage || "splash"
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    initialState?.userEmail || null
  );
  const [selectedOS, setSelectedOS] = useState<string | null>(
    initialState?.selectedOS || null
  );

  // Save boot state to localStorage
  const saveBootState = (state: BootState) => {
    try {
      localStorage.setItem(BOOT_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving boot state:", error);
    }
  };

  // Check for existing boot state on mount and handle completion
  useEffect(() => {
    if (
      initialState?.stage === "complete" &&
      initialState.selectedOS &&
      initialState.userEmail
    ) {
      onComplete();
    }
  }, [initialState, onComplete]);

  // Update boot state whenever relevant state changes, but only if we're not already complete
  useEffect(() => {
    // Don't update if we haven't changed from initial state
    if (!bootStage || bootStage === initialState?.stage) return;

    const currentState: BootState = {
      stage: bootStage,
      userEmail,
      selectedOS,
    };
    saveBootState(currentState);
  }, [bootStage, userEmail, selectedOS, initialState?.stage]);

  // Handle window unload to ensure state is saved
  useEffect(() => {
    const handleBeforeUnload = () => {
      const finalState: BootState = {
        stage: bootStage,
        userEmail,
        selectedOS,
      };
      saveBootState(finalState);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [bootStage, userEmail, selectedOS]);

  const handleOSSelect = (os: string) => {
    const updatedState: BootState = {
      stage: "complete",
      userEmail,
      selectedOS: os,
    };
    setSelectedOS(os);
    setBootStage("complete");
    saveBootState(updatedState);
    onComplete();
  };

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
    return <OSSelector onSelect={handleOSSelect} />;
  }

  return null;
}
