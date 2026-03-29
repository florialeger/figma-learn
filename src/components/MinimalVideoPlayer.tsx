"use client";

import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";

interface PlayIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

function PlayIcon({ size = 24, className = "", ...props }: PlayIconProps) {
  return (
    <div role="img" aria-label="Play" className={className} {...props}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 3.4C6 2.63 6.81 2.1 7.54 2.47L17.48 8.07C18.11 8.41 18.11 9.32 17.48 9.66L7.54 15.26C6.81 15.63 6 15.1 6 14.33V3.4Z" />
      </svg>
    </div>
  );
}

interface PauseIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

function PauseIcon({ size = 24, className = "", ...props }: PauseIconProps) {
  return (
    <div role="img" aria-label="Pause" className={className} {...props}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="6" y="3" width="5" height="18" rx="1" />
        <rect x="15" y="3" width="5" height="18" rx="1" />
      </svg>
    </div>
  );
}

export function MinimalVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);

  const startHideTimeout = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowControls(true);
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1500);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    startHideTimeout();
  };

  const handleMouseMove = () => {
    if (!showControls) {
      startHideTimeout();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowControls(false);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      startHideTimeout();
    };

    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => video.play();

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };

  const seekFromPointer = (clientX: number, target: HTMLDivElement) => {
    const video = videoRef.current;
    if (!video || video.duration <= 0) return;

    const rect = target.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
    startHideTimeout();
  };

  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    seekFromPointer(e.clientX, e.currentTarget);
  };

  return (
    <div
      className="group relative h-full w-full overflow-hidden rounded-sm bg-muted"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="z-0 h-full w-full object-cover"
        autoPlay
        playsInline
        muted
        loop
      />

      {isHovering && (
        <div
          className={`pointer-events-none absolute inset-0 z-10 bg-black/20 transition-opacity ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={togglePlayPause}
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon size={48} className="text-white drop-shadow-lg" />
            ) : (
              <PlayIcon size={48} className="text-white drop-shadow-lg" />
            )}
          </button>
        </div>
      )}

      <div
        onPointerDown={handleTimelinePointerDown}
        className={`absolute bottom-0 left-0 right-0 z-20 h-1 cursor-pointer bg-muted-foreground/20 transition-opacity ${
          isHovering
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute bottom-0 left-0 h-1 bg-foreground transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
