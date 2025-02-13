import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../store/multiplayer-store";
import { usePartyKit } from "../hooks/usePartyKit";
import { generateUserInfo } from "../utils/nameGenerator";
import "./CustomCursor.css";

export const CustomCursor = () => {
  const [isMultiplayerEnabled] = useAtom(isMultiplayerEnabledAtom);
  const { users, currentUser, isConnected } = usePartyKit(isMultiplayerEnabled);

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
        return (
          <div
            key={`cursor-${user.id}`}
            className="user-cursor"
            style={{
              transform: `translate(${user.position.x}px, ${user.position.y}px)`,
            }}
          >
            <div className="cursor-pointer cursor-pointer-animate">👆</div>
            <span className="user-label">{userInfo.name}</span>
          </div>
        );
      })}
    </div>
  );
};
