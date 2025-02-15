import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../store/multiplayer-store";
import { usePartyKit } from "../hooks/usePartyKit";
import { generateUserInfo } from "../utils/nameGenerator";
import { useState, useEffect, useCallback, useRef } from "react";
import "./CustomCursor.css";
import { Portal } from "@radix-ui/react-portal";

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
        {uniqueUsers.map((user) => {
          const userInfo = generateUserInfo(user.id);
          return (
            <div
              key={`cursor-${user.id}`}
              className="user-cursor"
              style={{
                transform: `translate(${user.position.x}px, ${user.position.y}px)`,
              }}
            >
              <div className="cursor-pointer cursor-pointer-animate">
                {user.id === currentUser?.id ? "↭" : "👆"}
              </div>
              <div className="user-label">
                {user.id === currentUser?.id ? (
                  isChatting ? (
                    <form
                      onSubmit={handleChatSubmit}
                      className="chat-input-container"
                    >
                      <input
                        ref={chatInputRef}
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type message..."
                        className="chat-input"
                        autoFocus
                      />
                      <div className="chat-hint">
                        Press Enter to send, Esc to cancel
                      </div>
                    </form>
                  ) : (
                    <div>
                      <span className="user-name">
                        {(currentUser as any).message ||
                          generateUserInfo(currentUser.id).name}
                      </span>
                      {currentUser.lastMessage && (
                        <span className="user-last-message">
                          {currentUser.lastMessage}
                        </span>
                      )}
                    </div>
                  )
                ) : (
                  <div>
                    <span className="user-name">
                      {(user as any).message || userInfo.name}
                    </span>
                    {user.lastMessage && (
                      <span className="user-last-message">
                        {user.lastMessage}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Portal>
  );
};
