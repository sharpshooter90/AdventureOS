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
  let session: UserPreferences;
  if (stored) {
    session = JSON.parse(stored);
  } else {
    session = { sessionId: crypto.randomUUID() };
  }

  // Check if a user email exists in localStorage and if not already set in session
  const email = localStorage.getItem("userEmail");
  if (email && !session.customName) {
    session.customName = email;
    localStorage.setItem("userPreferences", JSON.stringify(session));
  }

  return session;
};

export const updateUserPreferences = (prefs: Partial<UserPreferences>) => {
  const current = getUserSession();
  const updated = { ...current, ...prefs };
  localStorage.setItem("userPreferences", JSON.stringify(updated));
  return updated;
};
