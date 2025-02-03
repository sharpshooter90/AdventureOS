import { PageLayout } from "@/components/layout/page-layout";
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

export default function HomePage() {
  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen py-16 font-pixel">
        <AnimatedText
          text="Welcome!"
          className="text-4xl font-bold tracking-tight sm:text-5xl mb-6"
        />
        <p className="text-lg text-muted-foreground leading-relaxed space-y-2">
          <span className="block mb-4">
            Designer, helping{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="underline decoration-dotted text-gray-800 cursor-help">
                    others
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>actors ie: systems, agents, humans etc</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            to get their job done in pixels and code.
          </span>
          <span className="block mb-4">
            Enjoy building products with{" "}
            <HoverCard>
              <HoverCardTrigger>
                <span className="underline decoration-dotted text-gray-800 cursor-help">
                  startups
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-120 p-4 space-y-3">
                <h4 className="font-medium text-sm">Work Experience</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between items-center group border-l-2 border-cyan-500 hover:bg-accent/50 px-2 py-1  transition-colors cursor-pointer">
                    <span>Fractional Designer</span>
                    <div className="flex items-center  pl-2">
                      <div className="w-12 h-[1px] border-b border-dotted border-muted-foreground mx-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs">2022 - Present</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </li>
                  <li className="flex justify-between items-center group hover:bg-accent/50 px-2 py-1  transition-colors cursor-pointer">
                    <span>Head of Design at Trinkerr</span>
                    <div className="flex items-center">
                      <div className="w-12 h-[1px] border-b border-dotted border-muted-foreground mx-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs">2019 - 2021</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </li>
                  <li className="flex justify-between items-center group hover:bg-accent/50 px-2 py-1  transition-colors cursor-pointer">
                    <span>Sr Product Designer at OSlash</span>
                    <div className="flex items-center">
                      <div className="w-12 h-[1px] border-b border-dotted border-muted-foreground mx-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs">2018 - 2019</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </li>
                  <li className="flex justify-between items-center group hover:bg-accent/50 px-2 py-1  transition-colors cursor-pointer">
                    <span>Co-Founder at Sensibull</span>
                    <div className="flex items-center">
                      <div className="w-12 h-[1px] border-b border-dotted border-muted-foreground mx-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs">2016 - 2018</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>
            . Love climbing hills, one at a time.
          </span>
          <span className="block">
            Occasionally I drop myself to random parts of the{" "}
            <HoverCard>
              <HoverCardTrigger>
                <span className="underline decoration-dotted text-gray-800 cursor-help">
                  terrain
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-120 p-4 space-y-3">
                <h4 className="font-medium text-sm">Domain Experience</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between items-center group border-l-2 border-cyan-500 hover:bg-accent/50 px-2 py-1 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span>DevTools & Observability</span>
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        🎮 👾 🔭
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-[1px] border-b border-dotted border-muted-foreground mx-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs">Current</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </li>
                  <li className="flex justify-between items-center group hover:bg-accent/50 px-2 py-1 transition-colors cursor-pointer">
                    <span>Fintech Social Trading & Brokers</span>
                    <div className="flex items-center">
                      <div className="w-12 h-[1px] border-b border-dotted border-muted-foreground mx-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs">Previous</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </li>
                  <li className="flex justify-between items-center group hover:bg-accent/50 px-2 py-1 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span>Fintech Options Trading</span>
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        ♠️ ♣️ α β
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-[1px] border-b border-dotted border-muted-foreground mx-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs">Previous</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>{" "}
            out of curiosity.
          </span>
        </p>
      </div>
    </PageLayout>
  );
}
