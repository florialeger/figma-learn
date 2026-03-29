"use client";

import { forwardRef, useImperativeHandle } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface RefreshCCWIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface RefreshCCWIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const RefreshCCWIcon = forwardRef<RefreshCCWIconHandle, RefreshCCWIconProps>(
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
          <path d="M3 2v6h6" />
          <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
          <path d="M21 22v-6h-6" />
          <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
        </svg>
      </div>
    );
  },
);

RefreshCCWIcon.displayName = "RefreshCCWIcon";

export { RefreshCCWIcon };
