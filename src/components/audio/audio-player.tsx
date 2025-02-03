import { useEffect, useRef, useState } from "react";
import { Speech, Pause, Play, Square } from "lucide-react";
import { type Character, characters } from "@/data/audio-characters";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChar, setCurrentChar] = useState<Character | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const playCharacter = async (char: Character) => {
    if (audioRef.current) {
      try {
        audioRef.current.src = char.audioSrc;
        audioRef.current.volume = 0.5;
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        toast({
          variant: "destructive",
          title: "Error playing audio",
          description: "Could not load the audio file.",
        });
        setCurrentChar(null);
        setIsPlaying(false);
      }
    }
  };

  const playRandomCharacter = () => {
    const randomChar =
      characters[Math.floor(Math.random() * characters.length)];
    setCurrentChar(randomChar);
    playCharacter(randomChar);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentChar(null);
    });

    return () => {
      audio.remove();
    };
  }, []);

  return (
    <div className="flex items-center gap-1">
      {currentChar ? (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={playRandomCharacter}
                  className="text-xs w-4 h-4 inline-flex items-center justify-center hover:bg-accent rounded-full group"
                  aria-label="Shuffle character"
                >
                  <span className="group-hover:animate-spin">
                    {currentChar.icon}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to shuffle ({currentChar.name})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center gap-0.5">
            <button
              onClick={togglePlayPause}
              className="p-1 hover:bg-accent rounded-full"
              aria-label="Toggle playback"
            >
              {isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={stopAudio}
              className="p-1 hover:bg-accent rounded-full"
              aria-label="Stop playback"
            >
              <Square className="w-3 h-3" />
            </button>
          </div>
        </>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={playRandomCharacter}
                className="p-1 hover:bg-accent rounded-full relative group"
                aria-label="Play random character audio"
              >
                <Speech className="w-3 h-3 group-active:animate-pulse" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Play random character</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
