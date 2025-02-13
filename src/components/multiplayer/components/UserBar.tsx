import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../store/multiplayer-store";
import { usePartyKit } from "../hooks/usePartyKit";
import { generateUserInfo } from "../utils/nameGenerator";
import { useEffect, useState } from "react";
import "./UserBar.css";

interface UserInfo {
  name: string;
  color: string;
  avatar: string;
}

interface UserDisplay {
  id: string;
  info: UserInfo;
  isCurrentUser: boolean;
  customName?: string;
  isActive: boolean;
  lastSeen: number;
}

export const UserBar = () => {
  const [isMultiplayerEnabled] = useAtom(isMultiplayerEnabledAtom);
  const { users, currentUser, isConnected, updateCustomName } =
    usePartyKit(isMultiplayerEnabled);
  const [displayUsers, setDisplayUsers] = useState<UserDisplay[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  // Process users into display format with consistent naming
  useEffect(() => {
    if (!users.length || !isConnected) return;

    const uniqueUsers = Array.from(
      new Map(users.map((user) => [user.id, user])).values()
    );

    const now = Date.now();
    const processed = uniqueUsers.map((user) => {
      const info = generateUserInfo(user.id);
      const isActive = now - (user.lastSeen || 0) < 10000; // Consider active if seen in last 10 seconds
      return {
        id: user.id,
        info,
        isCurrentUser: user.id === currentUser?.id,
        customName: user.customName,
        isActive,
        lastSeen: user.lastSeen || now,
      };
    });

    setDisplayUsers(processed);
  }, [users, currentUser, isConnected]);

  if (!isMultiplayerEnabled || !isConnected || !displayUsers.length) {
    return null;
  }

  const handleNameEdit = (user: UserDisplay) => {
    if (!user.isCurrentUser) return;
    setIsEditing(true);
    setEditName(user.customName || user.info.name);
  };

  const handleNameSave = () => {
    if (editName.trim()) {
      updateCustomName(editName.trim());
    }
    setIsEditing(false);
    setEditName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditName("");
    }
  };

  const activeUsers = displayUsers.filter((user) => user.isActive);

  return (
    <div className="user-bar">
      <div className="user-bar-content">
        <div className="user-avatars">
          {displayUsers.map((user) => (
            <div
              key={`avatar-${user.id}`}
              className={`user-avatar-wrapper ${
                user.isActive ? "active" : "inactive"
              }`}
              title={
                user.isCurrentUser
                  ? `You (${user.customName || user.info.name})`
                  : `${user.customName || user.info.name}${
                      user.isActive ? " (Active)" : " (Inactive)"
                    }`
              }
              onClick={() => user.isCurrentUser && handleNameEdit(user)}
            >
              <div
                className={`user-avatar ${
                  user.isCurrentUser ? "current-user" : ""
                } ${user.isActive ? "active-user" : ""}`}
                style={{
                  backgroundColor: user.info.color,
                  borderColor: user.isCurrentUser ? "#fff" : "transparent",
                }}
              >
                {user.info.avatar}
              </div>
              <div
                className={`user-status-dot ${user.isActive ? "active" : ""}`}
              />
              {user.isCurrentUser && isEditing && (
                <div className="name-edit-popup">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    maxLength={20}
                    placeholder="Enter name..."
                  />
                  <button onClick={handleNameSave}>✓</button>
                  <button onClick={() => setIsEditing(false)}>✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="user-count">
          {activeUsers.length} active / {displayUsers.length} online
        </div>
      </div>
    </div>
  );
};
