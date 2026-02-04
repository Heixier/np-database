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
        <TooltipTrigger className="text-black/80 text-xs truncate">
          {bio}
        </TooltipTrigger>
        <TooltipContent>
          <p>{bio}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
