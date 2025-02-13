import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../store/multiplayer-store";
import { usePartyKit } from "../hooks/usePartyKit";
import { generateUserInfo } from "../utils/nameGenerator";
import { useState, useEffect, useCallback, useRef } from "react";
import "./CustomCursor.css";

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatInputRef = useRef<HTMLInputElement>(null);

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

  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && currentUser) {
      const newMessage: ChatMessage = {
        userId: currentUser.id,
        text: chatMessage,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);
      updateUserState({
        lastMessage: chatMessage,
        lastMessageTimestamp: Date.now(),
      });
      setChatMessage("");
      setIsChatting(false);
    }
  };

  // Clean up old messages
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setMessages((prev) => prev.filter((msg) => now - msg.timestamp < 5000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  if (!isMultiplayerEnabled || !isConnected || users.length === 0) {
    return null;
  }

  // Remove duplicate users and ensure unique entries
  const uniqueUsers = Array.from(
    new Map(users.map((user) => [user.id, user])).values()
  );

  return (
    <div className="connected-users">
      {uniqueUsers.map((user) => {
        if (user.id === currentUser?.id) return null;
        const userInfo = generateUserInfo(user.id);
        const userMessage = messages.find((m) => m.userId === user.id);
        const showMessage =
          userMessage && Date.now() - userMessage.timestamp < 5000;

        return (
          <div
            key={`cursor-${user.id}`}
            className="user-cursor"
            style={{
              transform: `translate(${user.position.x}px, ${user.position.y}px)`,
            }}
          >
            <div className="cursor-pointer cursor-pointer-animate">👆</div>
            <div className="user-label">
              <span className="user-name">
                {user.customName || userInfo.name}
              </span>
              {showMessage && (
                <div className="user-chat-bubble">{userMessage.text}</div>
              )}
            </div>
          </div>
        );
      })}

      {isChatting && currentUser && (
        <div
          className="user-cursor"
          style={{
            transform: `translate(${currentUser.position.x}px, ${currentUser.position.y}px)`,
          }}
        >
          <div className="cursor-pointer cursor-pointer-animate">👆</div>
          <div className="user-label">
            <span className="user-name">
              {currentUser.customName || generateUserInfo(currentUser.id).name}
            </span>
            <form onSubmit={handleChatSubmit} className="chat-input-container">
              <input
                ref={chatInputRef}
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type message..."
                className="chat-input"
              />
              <div className="chat-hint">
                Press Enter to send, Esc to cancel
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
