import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../../../components/multiplayer";
import { Switch } from "../../ui/switch";
import "./multiplayer-settings.css";
import { useState, useEffect } from "react";

// Animated ASCII art frames showing multiple mouse pointers interacting
const PARTY_ASCII_FRAMES = [
  `
+------------------------------------------+
|                                          |
|   ->[Zephyr]                             |
|                                          |
|                         ->[Nova]         |
|                                          |
|       ->[Orion]                          |
|                                          |
|                              ->[Luna]     |
+------------------------------------------+
  `,
  `
+------------------------------------------+
|                                          |
|   ->[Nova]                               |
|         ->[Zephyr]                        |
|                                          |
|       ->[Orion]                          |
|                                          |
|                 ->[Luna]                  |
|                                          |
+------------------------------------------+
  `,
  `
+------------------------------------------+
|                                          |
|                         ->[Nova]         |
|   ->[Zephyr]                             |
|                                          |
|       ->[Orion]                          |
|                                          |
|                              ->[Luna]    |
|                                          |
+------------------------------------------+
  `,
];

export const MultiplayerSettings = () => {
  const [isMultiplayerEnabled, setIsMultiplayerEnabled] = useAtom(
    isMultiplayerEnabledAtom
  );
  const [frameIndex, setFrameIndex] = useState(0);

  // Animate ASCII art
  useEffect(() => {
    if (!isMultiplayerEnabled) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % PARTY_ASCII_FRAMES.length);
    }, 500); // Faster animation for mouse movements

    return () => clearInterval(interval);
  }, [isMultiplayerEnabled]);

  return (
    <div className="multiplayer-settings">
      <div className="toggle-section">
        <div className="toggle-container">
          <Switch
            checked={isMultiplayerEnabled}
            onCheckedChange={setIsMultiplayerEnabled}
            id="multiplayer-toggle"
          />
          <label htmlFor="multiplayer-toggle" className="toggle-label">
            {isMultiplayerEnabled
              ? "Multiplayer Enabled"
              : "Multiplayer Disabled"}
          </label>
        </div>
        <div className="status-indicator">
          <div
            className={`status-dot ${isMultiplayerEnabled ? "active" : ""}`}
          />
          <span>{isMultiplayerEnabled ? "Connected" : "Offline"}</span>
        </div>
      </div>

      <div className={`ascii-art ${isMultiplayerEnabled ? "active" : ""}`}>
        {isMultiplayerEnabled
          ? PARTY_ASCII_FRAMES[frameIndex]
          : `
    ╭──────────────────╮
    │      zzz...     │
    │     👆          │
    │    (idle)       │
    │   no clicks     │
    │    💤  💤       │
    ╰──────────────────╯
       SLEEPING...
        `}
      </div>

      <div className="settings-content">
        <h2>Multiplayer Mode</h2>

        <div className="feature-description">
          <p>
            Enable real-time collaboration and see other users in your space!
          </p>
          <ul>
            <li>👥 See other users' cursors</li>
            <li>🎨 Collaborate in real-time</li>
            <li>💬 Share your presence</li>
            <li>🔄 Sync across tabs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
