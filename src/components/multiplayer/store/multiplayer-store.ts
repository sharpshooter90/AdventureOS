import { atom } from "jotai";

export const isMultiplayerEnabledAtom = atom<boolean>(false);

export interface UserPreferences {
  customName?: string;
  sessionId: string;
}

export interface User {
  id: string;
  position: { x: number; y: number };
  activeWindows: string[];
  lastSeen: number;
  customName?: string;
  lastMessage?: string;
  lastMessageTimestamp?: number;
}

export interface Message {
  type: "update" | "join" | "leave";
  user?: User;
  data?: any;
}

// Helper functions for session management
export const getUserSession = (): UserPreferences => {
  const stored = localStorage.getItem("userPreferences");
  if (stored) {
    return JSON.parse(stored);
  }

  // Create new session if none exists
  const newSession: UserPreferences = {
    sessionId: crypto.randomUUID(),
  };
  localStorage.setItem("userPreferences", JSON.stringify(newSession));
  return newSession;
};

export const updateUserPreferences = (prefs: Partial<UserPreferences>) => {
  const current = getUserSession();
  const updated = { ...current, ...prefs };
  localStorage.setItem("userPreferences", JSON.stringify(updated));
  return updated;
};
