import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../store/multiplayer-store";
import { usePartyKit } from "../hooks/usePartyKit";
import { useState, useEffect, useCallback, useRef } from "react";
import "./CustomCursor.css";
import { Portal } from "@radix-ui/react-portal";
import CursorItem from "./CursorItem";

interface ChatMessage {
  userId: string;
  text: string;
  timestamp: number;
}

export const CustomCursor = () => {
  const [isMultiplayerEnabled] = useAtom(isMultiplayerEnabledAtom);
  const { users, currentUser, isConnected, updateUserState } =
    usePartyKit(isMultiplayerEnabled);
  const [isChatting, setIsChatting] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const chatInputRef = useRef<HTMLInputElement>(null);
  const currentUserRef = useRef<typeof currentUser | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [, forceUpdate] = useState({});

  // Handle keyboard shortcuts
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "/" && !isChatting && isMultiplayerEnabled) {
        e.preventDefault();
        setIsChatting(true);
        setTimeout(() => chatInputRef.current?.focus(), 10);
      } else if (e.key === "Escape" && isChatting) {
        setIsChatting(false);
        setChatMessage("");
      }
    },
    [isChatting, isMultiplayerEnabled]
  );

  // Add an effect to update mousePositionRef on mousemove
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Modify handleChatSubmit to use mousePositionRef.current for position
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && currentUserRef.current) {
      updateUserState({
        position: mousePositionRef.current,
        lastMessage: chatMessage,
        lastMessageTimestamp: Date.now(),
      });
      setChatMessage("");
      setIsChatting(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({}); // Force re-render to update cursor states
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (!isMultiplayerEnabled || !isConnected) {
    return null;
  }

  // Ensure unique users
  const uniqueUsers = Array.from(
    new Map(users.map((user) => [user.id, user])).values()
  );

  return (
    <Portal>
      <div className="connected-users">
        {uniqueUsers.map((user) => (
          <CursorItem
            key={`cursor-${user.id}`}
            user={user}
            users={uniqueUsers}
            currentUser={currentUser}
            isChatting={isChatting}
            chatMessage={chatMessage}
            chatInputRef={chatInputRef}
            handleChatSubmit={handleChatSubmit}
            setChatMessage={setChatMessage}
          />
        ))}
      </div>
    </Portal>
  );
};
