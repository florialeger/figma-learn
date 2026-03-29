"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

interface PauseIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const PauseIcon = forwardRef<HTMLDivElement, PauseIconProps>(
  ({ className, size = 24, ...props }, ref) => (
    <div
      ref={ref}
      role="img"
      aria-label="Pause"
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
        <rect x="6" y="3" width="3" height="18" />
        <rect x="15" y="3" width="3" height="18" />
      </svg>
    </div>
  ),
);

PauseIcon.displayName = "PauseIcon";

export { PauseIcon };
