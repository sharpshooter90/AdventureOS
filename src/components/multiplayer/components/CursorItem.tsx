import { memo, useRef, useEffect } from "react";
import { User } from "../store/multiplayer-store";
import { generateUserInfo } from "../utils/nameGenerator";
import { getCursorEmoji } from "../utils/cursorState";

interface CursorItemProps {
  user: User;
  users: User[];
  currentUser: User | null;
  isChatting: boolean;
  chatMessage: string;
  chatInputRef: React.RefObject<HTMLInputElement>;
  handleChatSubmit: (e: React.FormEvent) => void;
  setChatMessage: (message: string) => void;
}

const CursorItem = memo(
  ({
    user,
    users,
    currentUser,
    isChatting,
    chatMessage,
    chatInputRef,
    handleChatSubmit,
    setChatMessage,
  }: CursorItemProps) => {
    const emojiRef = useRef<HTMLDivElement>(null);
    const userInfo = generateUserInfo(user.id);
    const isCurrentUser = user.id === currentUser?.id;

    useEffect(() => {
      if (!emojiRef.current) return;

      const updateEmoji = () => {
        if (emojiRef.current) {
          emojiRef.current.textContent = getCursorEmoji(
            user,
            users,
            currentUser,
            Date.now()
          );
        }
      };

      // Initial emoji
      updateEmoji();

      // Update emoji every second for state changes
      const interval = setInterval(updateEmoji, 1000);

      return () => clearInterval(interval);
    }, [user, users, currentUser]);

    return (
      <div
        className="user-cursor"
        style={{
          transform: `translate(${user.position.x}px, ${user.position.y}px)`,
          willChange: "transform",
        }}
      >
        <div className="cursor-pointer cursor-pointer-animate" ref={emojiRef} />
        <div className="user-label">
          {isCurrentUser ? (
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
                  {generateUserInfo(currentUser.id).name}
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
              <span className="user-name">{userInfo.name}</span>
              {user.lastMessage && (
                <span className="user-last-message">{user.lastMessage}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    return (
      prevProps.user.position.x === nextProps.user.position.x &&
      prevProps.user.position.y === nextProps.user.position.y &&
      prevProps.user.lastSeen === nextProps.user.lastSeen &&
      prevProps.user.lastMessage === nextProps.user.lastMessage &&
      prevProps.isChatting === nextProps.isChatting &&
      prevProps.chatMessage === nextProps.chatMessage &&
      prevProps.currentUser?.id === nextProps.currentUser?.id
    );
  }
);

CursorItem.displayName = "CursorItem";

export default CursorItem;
