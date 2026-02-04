"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const BioTooltip = ({ bio }: { bio: string | null }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="text-xs">
          <div className="line-clamp-3">{bio}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{bio}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
