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
        <TooltipTrigger className="text-xs w-full">
          <div className="w-full line-clamp-3 break-words">{bio}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{bio}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
