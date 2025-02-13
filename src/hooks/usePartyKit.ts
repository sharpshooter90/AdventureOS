import { useState, useEffect, useCallback } from "react";

interface PartyConnection {
  send: (data: string) => void;
  close: () => void;
  addEventListener: (event: string, handler: (event: any) => void) => void;
  removeEventListener: (event: string, handler: (event: any) => void) => void;
}

interface User {
  id: string;
  position: { x: number; y: number };
  activeWindows: string[];
}

interface Message {
  type: "update" | "join" | "leave";
  user?: User;
  data?: any;
}

export const usePartyKit = (isMultiplayerEnabled: boolean) => {
  const [connection, setConnection] = useState<PartyConnection | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isMultiplayerEnabled) {
      if (connection) {
        connection.close();
        setConnection(null);
        setUsers([]);
        setCurrentUser(null);
        setIsConnected(false);
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
        close: () => conn.close(),
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

      // Send initial join message with a stable ID
      const sessionId =
        localStorage.getItem("sessionId") ||
        Math.random().toString(36).substring(7);
      localStorage.setItem("sessionId", sessionId);

      partyConnection.send(
        JSON.stringify({
          type: "join",
          user: {
            id: sessionId,
            position: { x: 0, y: 0 },
            activeWindows: [],
          },
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
      setConnection(null);
      setIsConnected(false);
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
              setUsers((prev) => [...prev, message.user!]);
              if (!currentUser) {
                setCurrentUser(message.user);
              }
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
              setUsers(message.data.users);
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
    };
  }, [isMultiplayerEnabled]);

  const updateUserState = useCallback(
    (updates: Partial<User>) => {
      if (!connection || !currentUser) {
        console.log("Cannot update state: no connection or current user");
        return;
      }

      const updatedUser = { ...currentUser, ...updates };
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

  return {
    users,
    currentUser,
    updateUserState,
    isConnected,
    error,
  };
};
