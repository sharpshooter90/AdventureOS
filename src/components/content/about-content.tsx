import { AnimatedText } from "@/components/animated-text";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import { HoverAudioItem } from "@/components/hover-audio-item";

export function Content() {
  return (
    <div className="flex flex-col font-pixel">
      <AnimatedText
        text="Welcome!"
        className="text-4xl font-bold tracking-tight sm:text-5xl mb-6"
      />
      <p className="text-lg text-muted-foreground leading-relaxed space-y-2">
        {/* ... existing content ... */}
      </p>
    </div>
  );
}
