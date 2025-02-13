import { atom } from "jotai";

export const isMultiplayerEnabledAtom = atom<boolean>(false);

export interface User {
  id: string;
  position: { x: number; y: number };
  activeWindows: string[];
  lastSeen: number;
}

export interface Message {
  type: "update" | "join" | "leave";
  user?: User;
  data?: any;
}
