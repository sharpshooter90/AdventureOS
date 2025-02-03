import { useHoverAudio } from "../hooks/use-hover-audio";
import { cn } from "@/lib/utils";

interface HoverAudioItemProps extends React.HTMLAttributes<HTMLLIElement> {
  soundUrl: string;
  children: React.ReactNode;
}

export function HoverAudioItem({
  soundUrl,
  children,
  className,
  ...props
}: HoverAudioItemProps) {
  const { playSound } = useHoverAudio(soundUrl);

  return (
    <li onMouseEnter={playSound} className={cn("", className)} {...props}>
      {children}
    </li>
  );
}
