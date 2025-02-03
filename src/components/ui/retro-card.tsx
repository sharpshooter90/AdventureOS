"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RetroCardProps {
  title?: string;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RetroCard({
  title = "Untitled",
  icon = "🍎",
  children,
  className,
  onClick,
}: RetroCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "w-64 bg-white border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
    >
      <div className="bg-white border-b border-black">
        <div className="h-5 flex items-center space-x-1 px-1 bg-[repeating-linear-gradient(to_right,#000_0px,#000_1px,transparent_1px,transparent_2px)]">
          <span className="font-pixel text-sm leading-none bg-white px-1 border-r border-black">
            {icon}
          </span>
          <div className="w-3 h-3 border border-black flex items-center justify-center">
            <div className="w-2 h-0.5 bg-black" />
          </div>
          <div className="font-pixel text-md">{title}</div>
        </div>
      </div>
      <CardContent className="p-2 space-y-2 text-md">{children}</CardContent>
    </Card>
  );
}
