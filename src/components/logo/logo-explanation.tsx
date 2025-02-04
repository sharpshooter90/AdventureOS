import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { AudioPlayer } from "@/components/audio/audio-player";
import { RetroCard } from "@/components/ui/retro-card";

export function LogoExplanation() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link to="/" className="text-[32px] font-bold font-pixel">
          A11D
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-0">
        <RetroCard title="A11D" icon="🎮">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white border border-black flex items-center justify-center">
                <div className="w-6 h-5 bg-black" />
              </div>
              <div>
                <p className="font-pixel text-xs">Adventureland</p>
                <AudioPlayer />
              </div>
            </div>
            <div className="font-pixelArial leading-tight text-xs">
              <p>A numeronym where:</p>
              <p className="mt-1">
                a<span className="text-cyan-600">&lt;11 characters&gt;</span>d
              </p>
              <p className="mt-1 opacity-80">
                Similar to how "a11y" is used for "accessibility"
              </p>
            </div>
          </div>
        </RetroCard>
      </HoverCardContent>
    </HoverCard>
  );
}
