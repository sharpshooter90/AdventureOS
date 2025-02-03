import { useCallback, useEffect, useRef } from "react";

export function useHoverAudio(soundUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = 0.2;

      // Preload the audio
      audioRef.current.load();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  }, [soundUrl]);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error playing audio:", error);
          });
        }
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        console.error("Error stopping audio:", error);
      }
    }
  }, []);

  return { playSound, stopSound };
}
