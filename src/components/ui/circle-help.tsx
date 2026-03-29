"use client";

import { forwardRef, useImperativeHandle } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CircleHelpIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CircleHelpIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CircleHelpIcon = forwardRef<CircleHelpIconHandle, CircleHelpIconProps>(
  ({ className, size = 28, ...props }, ref) => {
    useImperativeHandle(ref, () => ({
      startAnimation: () => undefined,
      stopAnimation: () => undefined,
    }));

    return (
      <div className={cn(className)} {...props}>
        <svg
          fill="none"
          height={size}
          width={size}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </div>
    );
  },
);

CircleHelpIcon.displayName = "CircleHelpIcon";

export { CircleHelpIcon };
