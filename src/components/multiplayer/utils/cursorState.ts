import { User } from "../store/multiplayer-store";

export interface CursorState {
  isIdle: boolean;
  proximityLevel: "none" | "near" | "collision" | "post-collision";
}

export const IDLE_THRESHOLD = 10000; // 10 seconds in milliseconds
export const NEAR_THRESHOLD = 100; // 100 pixels
export const COLLISION_THRESHOLD = 50; // 50 pixels
export const POST_COLLISION_DURATION = 2000; // 2 seconds to show 🙏

// Keep track of last collision times
const lastCollisions = new Map<string, number>();

export const calculateDistance = (
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
) => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getCursorState = (
  user: User,
  users: User[],
  currentTime: number
): CursorState => {
  const isIdle = currentTime - user.lastSeen > IDLE_THRESHOLD;

  let closestDistance = Infinity;
  users.forEach((otherUser) => {
    if (otherUser.id === user.id) return;
    const distance = calculateDistance(user.position, otherUser.position);
    if (distance < closestDistance) {
      closestDistance = distance;
    }
  });

  // Check if we were in collision recently
  const lastCollisionTime = lastCollisions.get(user.id) || 0;
  const timeSinceCollision = currentTime - lastCollisionTime;

  // Update collision state
  if (closestDistance < COLLISION_THRESHOLD) {
    lastCollisions.set(user.id, currentTime);
    return { isIdle, proximityLevel: "collision" };
  } else if (timeSinceCollision < POST_COLLISION_DURATION) {
    return { isIdle, proximityLevel: "post-collision" };
  } else if (closestDistance < NEAR_THRESHOLD) {
    return { isIdle, proximityLevel: "near" };
  }

  return { isIdle, proximityLevel: "none" };
};

export const getCursorEmoji = (
  user: User,
  users: User[],
  currentUser: User | null,
  currentTime: number
): string => {
  const { isIdle, proximityLevel } = getCursorState(user, users, currentTime);

  if (isIdle) return "😴";

  switch (proximityLevel) {
    case "collision":
      return "🤬";
    case "post-collision":
      return "🙏";
    case "near":
      return "😡";
    default:
      return user.id === currentUser?.id ? "↭" : "👆";
  }
};
