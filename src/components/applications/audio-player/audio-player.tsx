import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";
import { soundManager } from "../../dialog/sound-manager";
import { YouTubePlayer } from "./youtube-player";
import "./audio-player.css";

interface Track {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnailUrl?: string;
  genre?: string;
}

const demoTracks: Track[] = [
  {
    id: "1",
    title: "Resonance",
    artist: "HOME",
    videoId: "8GW6sLrK40k",
    genre: "Synthwave",
    thumbnailUrl: "https://i.ytimg.com/vi/8GW6sLrK40k/maxresdefault.jpg",
  },
  {
    id: "2",
    title: "Midnight City",
    artist: "M83",
    videoId: "dX3k_QDnzHE",
    genre: "Electronic",
    thumbnailUrl: "https://i.ytimg.com/vi/dX3k_QDnzHE/maxresdefault.jpg",
  },
  {
    id: "3",
    title: "Stranger Things",
    artist: "C418",
    videoId: "Jmv5pTyz--I",
    genre: "Synthwave",
    thumbnailUrl: "https://i.ytimg.com/vi/Jmv5pTyz--I/maxresdefault.jpg",
  },
];

const FALLBACK_TRACKS: Track[] = [
  {
    id: "fb1",
    title: "8-Bit Retro Funk",
    artist: "David Renda",
    genre: "Chiptune",
    videoId: "https://cdn.pixabay.com/audio/2023/09/30/audio_7a751ec6fe.mp3",
  },
  {
    id: "fb2",
    title: "Arcade Energy",
    artist: "AlexiAction",
    genre: "Chiptune",
    videoId: "https://cdn.pixabay.com/audio/2023/05/22/audio_1ae99e8ae5.mp3",
  },
];

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState<Track[]>([]);
  const [player, setPlayer] = useState<any>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  const getTrackList = () => {
    const tracks = useFallback ? FALLBACK_TRACKS : demoTracks;
    return isShuffled ? shuffledTracks : tracks;
  };

  const handlePlayerReady = (ytPlayer: any) => {
    setPlayer(ytPlayer);
    setIsLoading(false);
  };

  const handlePlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
      case window.YT.PlayerState.ENDED:
        handleTrackEnd();
        break;
    }
  };

  const handlePlayerError = (error: any) => {
    console.error("YouTube Player Error:", error);
    setIsLoading(false);
  };

  useEffect(() => {
    if (player) {
      const updateTime = setInterval(() => {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
      }, 1000);

      return () => clearInterval(updateTime);
    }
  }, [player]);

  const shuffleTracks = () => {
    const shuffled = [...demoTracks].sort(() => Math.random() - 0.5);
    setShuffledTracks(shuffled);
    setIsShuffled(true);
    soundManager.play("actionClick");
  };

  const unshuffleTracks = () => {
    setIsShuffled(false);
    soundManager.play("actionClick");
  };

  const getCurrentTrackIndex = () => {
    if (!currentTrack) return -1;
    return getTrackList().findIndex((t) => t.id === currentTrack.id);
  };

  const playNextTrack = () => {
    const currentIndex = getCurrentTrackIndex();
    const tracks = getTrackList();
    if (currentIndex >= 0 && currentIndex < tracks.length - 1) {
      playTrack(tracks[currentIndex + 1]);
    }
  };

  const playPreviousTrack = () => {
    const currentIndex = getCurrentTrackIndex();
    const tracks = getTrackList();
    if (currentIndex > 0) {
      playTrack(tracks[currentIndex - 1]);
    }
  };

  const playTrack = (track: Track) => {
    setIsLoading(true);
    setCurrentTrack(track);
    if (player) {
      player.loadVideoById(track.videoId);
      player.setVolume(volume);
    }
    soundManager.play("actionClick");
  };

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      soundManager.play("defaultClick");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Add keyboard controls
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!player) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          playPreviousTrack();
          break;
        case "ArrowRight":
          playNextTrack();
          break;
        case "ArrowUp":
          const newVolUp = Math.min(volume + 10, 100);
          setVolume(newVolUp);
          player.setVolume(newVolUp);
          break;
        case "ArrowDown":
          const newVolDown = Math.max(volume - 10, 0);
          setVolume(newVolDown);
          player.setVolume(newVolDown);
          break;
      }
    },
    [player, volume]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Optimize progress bar with seeking functionality
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;

    player.seekTo(newTime);
    setCurrentTime(newTime);
  };

  // Add repeat and autoplay functionality
  const [isRepeat, setIsRepeat] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const handleTrackEnd = useCallback(() => {
    if (isRepeat && currentTrack) {
      player.seekTo(0);
      player.playVideo();
    } else if (isAutoplay) {
      playNextTrack();
    } else {
      setIsPlaying(false);
    }
  }, [isRepeat, isAutoplay, currentTrack, player]);

  return (
    <Card className="w-full h-full bg-zinc-900 text-white p-4 flex flex-col gap-4 border-2 border-zinc-700 rounded-lg shadow-lg retro-player">
      {currentTrack && (
        <YouTubePlayer
          videoId={currentTrack.videoId}
          onReady={handlePlayerReady}
          onStateChange={handlePlayerStateChange}
          onError={handlePlayerError}
        />
      )}

      <div className="flex flex-col items-center gap-2">
        <div
          className="w-full h-32 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center p-4 retro-display"
          style={{
            backgroundImage: currentTrack?.thumbnailUrl
              ? `url(${currentTrack.thumbnailUrl})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-black bg-opacity-50 p-4 rounded-lg">
            {isLoading ? (
              <div className="text-green-400 animate-pulse">Loading...</div>
            ) : currentTrack ? (
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-400 mb-1 retro-text">
                  {currentTrack.title}
                </h3>
                <p className="text-sm text-zinc-400">{currentTrack.artist}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {currentTrack.genre}
                </p>
              </div>
            ) : (
              <span className="text-zinc-500">Select a track to play</span>
            )}
          </div>
        </div>

        <div className="w-full flex items-center gap-2 px-4">
          <span className="text-xs text-green-400 font-mono">
            {formatTime(currentTime)}
          </span>
          <div
            ref={progressRef}
            className="flex-1 h-2 bg-zinc-800 rounded-full cursor-pointer hover:bg-zinc-700 transition-colors"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-green-500 rounded-full transition-all relative group"
              style={{
                width: `${(currentTime / duration) * 100}%`,
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-green-400 font-mono">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-full border-2 border-zinc-700 hover:bg-zinc-800 hover:text-green-400 retro-button"
              onClick={playPreviousTrack}
              disabled={
                !currentTrack || isLoading || getCurrentTrackIndex() <= 0
              }
              title="Previous (Left Arrow)"
            >
              ⏮
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "w-12 h-12 rounded-full border-2 transition-all transform hover:scale-110",
                isPlaying
                  ? "border-green-500 text-green-400"
                  : "border-zinc-700 hover:border-green-500 hover:text-green-400",
                "retro-button"
              )}
              onClick={togglePlayPause}
              disabled={!currentTrack || isLoading}
              title="Play/Pause (Space)"
            >
              {isPlaying ? "⏸" : "▶"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-full border-2 border-zinc-700 hover:bg-zinc-800 hover:text-green-400 retro-button"
              onClick={playNextTrack}
              disabled={
                !currentTrack ||
                isLoading ||
                getCurrentTrackIndex() >= getTrackList().length - 1
              }
              title="Next (Right Arrow)"
            >
              ⏭
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs">🔈</span>
              <Input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 retro-slider"
                title="Volume (Up/Down Arrows)"
              />
              <span className="text-xs">��</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-colors",
                  isRepeat
                    ? "border-green-500 text-green-400"
                    : "border-zinc-700 hover:bg-zinc-800 hover:text-green-400",
                  "retro-button"
                )}
                onClick={() => setIsRepeat(!isRepeat)}
                title="Repeat current track"
              >
                🔁
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-colors",
                  isAutoplay
                    ? "border-green-500 text-green-400"
                    : "border-zinc-700 hover:bg-zinc-800 hover:text-green-400",
                  "retro-button"
                )}
                onClick={() => setIsAutoplay(!isAutoplay)}
                title="Autoplay next track"
              >
                ⏩
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-colors",
                  isShuffled
                    ? "border-green-500 text-green-400"
                    : "border-zinc-700 hover:bg-zinc-800 hover:text-green-400",
                  "retro-button"
                )}
                onClick={isShuffled ? unshuffleTracks : shuffleTracks}
                title="Shuffle playlist"
              >
                🔀
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-green-400 retro-text">
            Playlist {isShuffled && "(Shuffled)"} {useFallback && "(Fallback)"}
          </h3>
          {useFallback && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs border border-zinc-700 hover:bg-zinc-800 hover:text-green-400"
              onClick={() => {
                setUseFallback(false);
                setErrorCount(0);
              }}
            >
              Try Original Tracks
            </Button>
          )}
        </div>
        <div className="space-y-1">
          {getTrackList().map((track) => (
            <button
              key={track.id}
              onClick={() => playTrack(track)}
              className={cn(
                "w-full p-2 text-left rounded hover:bg-zinc-800 transition-colors retro-track",
                currentTrack?.id === track.id &&
                  "bg-zinc-800 text-green-400 border-l-4 border-green-400"
              )}
              disabled={isLoading}
            >
              <div className="text-sm font-medium">{track.title}</div>
              <div className="text-xs text-zinc-500">{track.artist}</div>
              {track.genre && (
                <div className="text-xs text-zinc-600">{track.genre}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
