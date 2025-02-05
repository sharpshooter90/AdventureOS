import { useEffect, useRef } from "react";

// Using more appropriate sound effects
const SOUND_FILES = {
  keyPress: "https://cdn.freesound.org/previews/39/39013_60744-lq.mp3", // beep for keypress
  boot: "https://cdn.freesound.org/previews/409/409031_7122735-lq.mp3", // powerOn for boot
  error: "https://cdn.freesound.org/previews/39/39013_60744-lq.mp3", // beep for error
  success: "https://cdn.freesound.org/previews/628/628240_890072-lq.mp3", // diskDrive for success
  click: "https://cdn.freesound.org/previews/39/39013_60744-lq.mp3", // beep for click
  beep: "https://cdn.freesound.org/previews/39/39013_60744-lq.mp3",
  explainerHover: "https://cdn.freesound.org/previews/628/628240_890072-lq.mp3", // diskDrive for section changes
  hover: "https://cdn.freesound.org/previews/39/39013_60744-lq.mp3", // beep for hover
  powerOn: "https://cdn.freesound.org/previews/409/409031_7122735-lq.mp3",
  diskDrive: "https://cdn.freesound.org/previews/628/628240_890072-lq.mp3",
  hum: "https://cdn.freesound.org/previews/725/725338_13645124-lq.mp3",
} as const;

// Preload sounds for better performance
const soundCache = new Map();

Object.entries(SOUND_FILES).forEach(([key, path]) => {
  const audio = new Audio(path);
  // Set different volumes for different sounds
  switch (key) {
    case "hum":
      audio.volume = 0.1; // Lower volume for ambient hum
      audio.loop = true; // Loop the hum sound
      break;
    case "powerOn":
      audio.volume = 0.3;
      break;
    case "diskDrive":
      audio.volume = 0.2;
      break;
    default:
      audio.volume = 0.15; // Lower default volume for beeps
  }
  soundCache.set(key, audio);
});

export const playSound = (soundName: keyof typeof SOUND_FILES) => {
  const audio = soundCache.get(soundName);
  if (audio) {
    if (soundName === "hum") {
      // Don't reset hum sound if it's already playing
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    } else {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }
};

// Add function to stop sounds (especially useful for hum)
export const stopSound = (soundName: keyof typeof SOUND_FILES) => {
  const audio = soundCache.get(soundName);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};
