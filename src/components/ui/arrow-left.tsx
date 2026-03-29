"use client";

import { forwardRef, useImperativeHandle } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ArrowLeftIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ArrowLeftIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ArrowLeftIcon = forwardRef<ArrowLeftIconHandle, ArrowLeftIconProps>(
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
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </div>
    );
  },
);

ArrowLeftIcon.displayName = "ArrowLeftIcon";

export { ArrowLeftIcon };
