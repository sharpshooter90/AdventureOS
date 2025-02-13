import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { isMultiplayerEnabledAtom } from "../store/multiplayer-store";
import { usePartyKit } from "../hooks/usePartyKit";
import { throttle } from "lodash";
import { UserBar } from "./UserBar";
import { CustomCursor } from "./CustomCursor";

interface MultiplayerProviderProps {
  children: React.ReactNode;
}

export const MultiplayerProvider = ({ children }: MultiplayerProviderProps) => {
  const [isMultiplayerEnabled] = useAtom(isMultiplayerEnabledAtom);
  const { currentUser, updateUserState } = usePartyKit(isMultiplayerEnabled);

  // Throttled update function to prevent too many updates
  const throttledUpdatePosition = useCallback(
    throttle((x: number, y: number) => {
      if (currentUser) {
        updateUserState({
          position: { x, y },
          activeWindows: currentUser.activeWindows || [],
        });
      }
    }, 16), // Update every 16ms (60fps)
    [currentUser, updateUserState]
  );

  useEffect(() => {
    if (isMultiplayerEnabled) {
      console.log("Multiplayer mode enabled");

      const handleMouseMove = (e: MouseEvent) => {
        // Get coordinates relative to the viewport
        throttledUpdatePosition(e.clientX, e.clientY);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        throttledUpdatePosition.cancel();
      };
    }
  }, [isMultiplayerEnabled, throttledUpdatePosition]);

  return (
    <>
      {children}
      {isMultiplayerEnabled && (
        <>
          <UserBar />
          <CustomCursor />
        </>
      )}
    </>
  );
};
