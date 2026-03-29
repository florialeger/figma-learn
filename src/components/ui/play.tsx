"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

interface PlayIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const PlayIcon = forwardRef<HTMLDivElement, PlayIconProps>(
  ({ className, size = 24, ...props }, ref) => (
    <div
      ref={ref}
      role="img"
      aria-label="Play"
      className={className}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    </div>
  ),
);

PlayIcon.displayName = "PlayIcon";

export { PlayIcon };
