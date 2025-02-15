import { useState, useEffect, useCallback, useRef } from "react";
import {
  User,
  Message,
  getUserSession,
  updateUserPreferences,
} from "../store/multiplayer-store";
import { throttle } from "lodash";

interface PartyConnection {
  send: (data: string) => void;
  close: () => void;
  addEventListener: (event: string, handler: (event: any) => void) => void;
  removeEventListener: (event: string, handler: (event: any) => void) => void;
}

export const usePartyKit = (isMultiplayerEnabled: boolean) => {
  const [connection, setConnection] = useState<PartyConnection | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const currentUserRef = useRef<User | null>(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Clear all state when multiplayer is disabled
  const clearState = useCallback(() => {
    setConnection(null);
    setUsers([]);
    setCurrentUser(null);
    setIsConnected(false);
    setError(null);
  }, []);

  const updateUserState = useCallback(
    (updates: Partial<User>) => {
      if (!connection || !currentUser) {
        console.log("Cannot update state: no connection or current user");
        return;
      }

      // Store position for focus/blur handling
      if (updates.position) {
        setLastPosition(updates.position);
      }

      const updatedUser = {
        ...currentUser,
        ...updates,
        lastSeen: Date.now(),
      };

      if (updates.lastMessage !== undefined) {
        localStorage.setItem(
          "userLastMessage",
          JSON.stringify({
            lastMessage: updates.lastMessage,
            lastMessageTimestamp: updatedUser.lastMessageTimestamp,
          })
        );
      }

      console.log("Updating user state:", updatedUser);
      setCurrentUser(updatedUser);

      connection.send(
        JSON.stringify({
          type: "update",
          user: updatedUser,
        })
      );
    },
    [connection, currentUser]
  );

  useEffect(() => {
    if (!isMultiplayerEnabled || !connection || !currentUser) return;

    const handleFocus = () => {
      console.log("Window focused, reconnecting...");
      updateUserState({ position: lastPosition });
    };

    const handleBlur = () => {
      console.log("Window blurred, maintaining connection...");
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [
    isMultiplayerEnabled,
    connection,
    currentUser,
    lastPosition,
    updateUserState,
  ]);

  useEffect(() => {
    if (!isMultiplayerEnabled) {
      if (connection) {
        console.log("Disconnecting from multiplayer...");
        connection.close();
        clearState();
      }
      return;
    }

    // Prevent multiple connections
    if (connection || isConnected) {
      console.log("Connection already exists, skipping new connection");
      return;
    }

    let isCleanedUp = false;

    console.log("Connecting to PartyKit server...");
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = import.meta.env.DEV ? "localhost:1999" : window.location.host;
    const wsUrl = `${wsProtocol}//${host}/party/adventure`;
    console.log("WebSocket URL:", wsUrl);

    const conn = new WebSocket(wsUrl);

    conn.onopen = () => {
      if (isCleanedUp) return;
      console.log("WebSocket connection established");
      setIsConnected(true);
      setError(null);

      const partyConnection: PartyConnection = {
        send: (data: string) => {
          if (!conn || conn.readyState !== WebSocket.OPEN) return;
          console.log("Sending data:", data);
          conn.send(data);
        },
        close: () => {
          console.log("Closing connection...");
          conn.close();
          clearState();
        },
        addEventListener: (event: string, handler: (event: any) => void) => {
          if (event === "message") {
            conn.onmessage = (e) => {
              console.log("Received message:", e.data);
              handler(e);
            };
          }
        },
        removeEventListener: (event: string, handler: (event: any) => void) => {
          if (event === "message") {
            conn.onmessage = null;
          }
        },
      };

      setConnection(partyConnection);

      // Use persistent session ID
      const { sessionId, customName } = getUserSession();

      const storedLastMessage = localStorage.getItem("userLastMessage");
      let lastMessage: string | undefined;
      let lastMessageTimestamp: number | undefined;
      if (storedLastMessage) {
        try {
          const parsed = JSON.parse(storedLastMessage);
          lastMessage = parsed.lastMessage;
          lastMessageTimestamp = parsed.lastMessageTimestamp;
        } catch (e) {
          console.error("Failed to parse stored last message:", e);
        }
      }

      const initialUser = {
        id: sessionId,
        position: { x: 0, y: 0 },
        activeWindows: [],
        lastSeen: Date.now(),
        customName,
        lastMessage,
        lastMessageTimestamp,
      };

      setCurrentUser(initialUser);

      partyConnection.send(
        JSON.stringify({
          type: "join",
          user: initialUser,
        })
      );
    };

    conn.onerror = (error) => {
      if (isCleanedUp) return;
      console.error("WebSocket error:", error);
      setError(new Error("Failed to connect to multiplayer server"));
      setIsConnected(false);
    };

    conn.onclose = () => {
      if (isCleanedUp) return;
      console.log("WebSocket connection closed");
      clearState();
    };

    const messageHandler = (event: MessageEvent) => {
      if (isCleanedUp) return;
      try {
        const message = JSON.parse(event.data) as Message;
        console.log("Parsed message:", message);

        switch (message.type) {
          case "join":
            if (message.user) {
              console.log("User joined:", message.user);
              setUsers((prev) => {
                // Remove any existing user with the same ID
                const filtered = prev.filter((u) => u.id !== message.user!.id);
                return [...filtered, message.user!];
              });
            }
            break;
          case "leave":
            if (message.user) {
              console.log("User left:", message.user);
              setUsers((prev) => prev.filter((u) => u.id !== message.user!.id));
            }
            break;
          case "update":
            if (message.data?.users) {
              console.log("Users updated:", message.data.users);
              // Filter out stale users and duplicates
              const uniqueUsers = Array.from(
                new Map(
                  (message.data.users as User[])
                    .filter((user) => {
                      // Remove users that haven't been seen in 30 seconds
                      const now = Date.now();
                      return now - user.lastSeen < 30000;
                    })
                    .map((user) => [user.id, user])
                ).values()
              );
              setUsers(uniqueUsers);

              // NEW: Update currentUser state and localStorage if there's a new lastMessage or timestamp
              if (currentUserRef.current) {
                const updatedCurrentUser = uniqueUsers.find(
                  (u) => u.id === currentUserRef.current!.id
                );
                if (
                  updatedCurrentUser &&
                  (updatedCurrentUser.lastMessage !==
                    currentUserRef.current.lastMessage ||
                    updatedCurrentUser.lastMessageTimestamp !==
                      currentUserRef.current.lastMessageTimestamp)
                ) {
                  setCurrentUser(updatedCurrentUser);
                  localStorage.setItem(
                    "userLastMessage",
                    JSON.stringify({
                      lastMessage: updatedCurrentUser.lastMessage,
                      lastMessageTimestamp:
                        updatedCurrentUser.lastMessageTimestamp,
                    })
                  );
                }
              }
            }
            break;
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    conn.addEventListener("message", messageHandler);

    return () => {
      console.log("Cleaning up WebSocket connection");
      isCleanedUp = true;
      conn.removeEventListener("message", messageHandler);
      conn.close();
      clearState();
    };
  }, [isMultiplayerEnabled, clearState]);

  const updateCustomName = useCallback(
    (name: string) => {
      updateUserPreferences({ customName: name });
      if (currentUser) {
        updateUserState({ customName: name });
      }
    },
    [currentUser, updateUserState]
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "userLastMessage" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          // Use currentUserRef to get the latest value
          if (
            currentUserRef.current &&
            currentUserRef.current.lastMessage !== parsed.lastMessage
          ) {
            setCurrentUser({
              ...currentUserRef.current,
              lastMessage: parsed.lastMessage,
              lastMessageTimestamp: parsed.lastMessageTimestamp,
            });
          }
        } catch (err) {
          console.error("Error parsing userLastMessage from storage", err);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    users,
    currentUser,
    updateUserState,
    updateCustomName,
    isConnected,
    error,
  };
};
