"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const BioTooltip = ({ bio }: { bio: string | null }) => {
  return (
    <Tooltip>
      <TooltipTrigger className="text-black/80 text-xs truncate">
        {bio}
      </TooltipTrigger>
      <TooltipContent>
        <p>{bio}</p>
      </TooltipContent>
    </Tooltip>
  );
};
