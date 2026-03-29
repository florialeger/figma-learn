"use client";

import { forwardRef, useImperativeHandle } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface EyeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface EyeIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const EyeIcon = forwardRef<EyeIconHandle, EyeIconProps>(
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
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    );
  },
);

EyeIcon.displayName = "EyeIcon";

export { EyeIcon };
