import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../store/multiplayer-store";
import { usePartyKit } from "../hooks/usePartyKit";
import { generateUserInfo } from "../utils/nameGenerator";
import "./UserBar.css";

export const UserBar = () => {
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
    <div className="user-bar">
      <div className="user-bar-content">
        <div className="user-avatars">
          {uniqueUsers.map((user) => {
            const userInfo = generateUserInfo(user.id);
            const isCurrentUser = user.id === currentUser?.id;

            return (
              <div
                key={`avatar-${user.id}`}
                className="user-avatar-wrapper"
                title={isCurrentUser ? `You (${userInfo.name})` : userInfo.name}
              >
                <div
                  className={`user-avatar ${
                    isCurrentUser ? "current-user" : ""
                  }`}
                  style={{
                    backgroundColor: userInfo.color,
                    borderColor: isCurrentUser ? "#fff" : "transparent",
                  }}
                >
                  {userInfo.avatar}
                </div>
                <div className="user-status-dot" />
              </div>
            );
          })}
        </div>
        <div className="user-count">{uniqueUsers.length} online</div>
      </div>
    </div>
  );
};
