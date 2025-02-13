import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../../../store/multiplayer";
import { usePartyKit } from "../../../hooks/usePartyKit";
import { generateUserInfo } from "../../../utils/nameGenerator";
import "./visitors.css";

interface User {
  id: string;
  position: { x: number; y: number };
  activeWindows: string[];
}

export const Visitors = () => {
  const [isMultiplayerEnabled] = useAtom(isMultiplayerEnabledAtom);
  const { users, currentUser, isConnected } = usePartyKit(isMultiplayerEnabled);

  if (!isMultiplayerEnabled || !isConnected) {
    return (
      <div className="visitors-container p-4 text-center">
        <p className="text-gray-500">Multiplayer mode is disabled</p>
        <p className="text-sm text-gray-400 mt-2">
          Enable multiplayer to see other visitors
        </p>
      </div>
    );
  }

  return (
    <div className="visitors-container p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Connected Visitors</h2>
        <p className="text-sm text-gray-500">
          {users.length} visitor{users.length !== 1 ? "s" : ""} online
        </p>
      </div>

      <div className="space-y-3">
        {users.map((user) => {
          const userInfo = generateUserInfo(user.id);
          const isCurrentUser = user.id === currentUser?.id;

          return (
            <div
              key={user.id}
              className={`visitor-card p-3 rounded-lg border ${
                isCurrentUser ? "current-user" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="visitor-avatar w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: userInfo.color }}
                >
                  {userInfo.avatar}
                </div>
                <div>
                  <p className="font-medium">
                    {isCurrentUser ? `You (${userInfo.name})` : userInfo.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.activeWindows.length} window
                    {user.activeWindows.length !== 1 ? "s" : ""} open
                  </p>
                </div>
              </div>
              <div className="visitor-stats mt-2 text-sm text-gray-500">
                Position: ({Math.round(user.position.x)},{" "}
                {Math.round(user.position.y)})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
