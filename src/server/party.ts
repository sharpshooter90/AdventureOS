import type * as Party from "partykit/server";

interface User {
  id: string;
  position: { x: number; y: number };
  activeWindows: string[];
  lastSeen: number;
  customName?: string;
}

interface Message {
  type: "update" | "join" | "leave";
  user?: User;
  data?: any;
}

export default class AdventureServer implements Party.Server {
  users: Map<string, User> = new Map();
  heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(readonly party: Party.Party) {
    // Start heartbeat to clean up stale users
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      let hasStaleUsers = false;

      for (const [id, user] of this.users.entries()) {
        // Remove users that haven't been seen in 30 seconds
        if (now - user.lastSeen > 30000) {
          console.log("Removing stale user:", user);
          this.users.delete(id);
          hasStaleUsers = true;
        }
      }

      if (hasStaleUsers) {
        this.broadcastState();
      }
    }, 5000);
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log("User connected:", conn.id);

    // When a user connects, create their initial state
    const userId = conn.id;

    // Check if user already exists
    const existingUser = this.users.get(userId);
    if (existingUser) {
      // Update last seen timestamp and maintain custom name
      const updatedUser = {
        ...existingUser,
        lastSeen: Date.now(),
      };
      this.users.set(userId, updatedUser);
      console.log("Updated existing user:", updatedUser);
    } else {
      // Create new user
      const user: User = {
        id: userId,
        position: { x: 0, y: 0 },
        activeWindows: [],
        lastSeen: Date.now(),
      };
      this.users.set(userId, user);
      console.log("Created new user:", user);
    }

    // Send current state to new user
    conn.send(
      JSON.stringify({
        type: "update",
        data: {
          users: Array.from(this.users.values()),
        },
      } as Message)
    );

    // Broadcast join to others
    this.party.broadcast(
      JSON.stringify({
        type: "join",
        user: this.users.get(userId),
      } as Message),
      [conn.id]
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const msg = JSON.parse(message) as Message;
      const connectionId = sender.id; // original connection id

      if (msg.type === "join" && msg.user) {
        const persistentId = msg.user.id || connectionId;
        // If a user exists with the connection id, rekey it
        const existingUser = this.users.get(connectionId);
        if (existingUser) {
          this.users.delete(connectionId);
        }
        // Create/Update the user using the persistentId
        const updatedUser = {
          ...msg.user,
          id: persistentId,
          lastSeen: Date.now(),
        };
        this.users.set(persistentId, updatedUser);
        console.log("User joined updated:", updatedUser);
        // Broadcast join to other connections
        this.party.broadcast(
          JSON.stringify({
            type: "join",
            user: updatedUser,
          }),
          [sender.id]
        );
      } else if (msg.type === "update" && msg.user) {
        const persistentId = msg.user.id || connectionId;
        const updatedUser = {
          ...msg.user,
          id: persistentId,
          lastSeen: Date.now(),
        };
        this.users.set(persistentId, updatedUser);
        console.log("Updated user state:", updatedUser);

        // Get unique users and broadcast update
        const uniqueUsers = Array.from(this.users.values());
        this.party.broadcast(
          JSON.stringify({
            type: "update",
            data: { users: uniqueUsers },
          })
        );
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  onClose(connection: Party.Connection) {
    console.log("User disconnected:", connection.id);
    this.users.delete(connection.id);

    // Get unique users after removal
    const uniqueUsers = Array.from(this.users.values());

    // Broadcast the updated state
    this.party.broadcast(
      JSON.stringify({
        type: "update",
        data: { users: uniqueUsers },
      } as Message)
    );
  }

  private broadcastState() {
    // Get unique users
    const uniqueUsers = Array.from(this.users.values());

    const state = {
      type: "update",
      data: {
        users: uniqueUsers,
      },
    } as Message;

    this.party.broadcast(JSON.stringify(state));
  }
}
