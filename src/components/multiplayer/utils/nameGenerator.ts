const adjectives = [
  "Happy",
  "Clever",
  "Swift",
  "Bright",
  "Cosmic",
  "Digital",
  "Pixel",
  "Retro",
  "Neon",
  "Cyber",
  "Quantum",
  "Virtual",
  "Mystic",
  "Techno",
  "Stellar",
];

const nouns = [
  "Explorer",
  "Coder",
  "Wizard",
  "Voyager",
  "Pioneer",
  "Surfer",
  "Hacker",
  "Dreamer",
  "Ninja",
  "Runner",
  "Pilot",
  "Captain",
  "Scout",
  "Ranger",
  "Agent",
];

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
  "#E74C3C",
  "#2ECC71",
];

export const generateUserInfo = (userId: string) => {
  // Use userId to consistently generate the same name for the same user
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const adjIndex = hash % adjectives.length;
  const nounIndex = (hash * 13) % nouns.length; // Use a prime number to get different distribution
  const colorIndex = (hash * 17) % colors.length;

  return {
    name: `${adjectives[adjIndex]} ${nouns[nounIndex]}`,
    color: colors[colorIndex],
    avatar: `${adjectives[adjIndex][0]}${nouns[nounIndex][0]}`, // Initials
  };
};
