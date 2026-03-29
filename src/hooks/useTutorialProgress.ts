"use client";

import { useCallback, useEffect, useState } from "react";
import type { TutorialProgress } from "@/types/tutorial";

const STORAGE_KEY = "figma-edu-tutorial-progress";

type ProgressMap = Record<string, TutorialProgress>;

function readStorage(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function useTutorialProgress(tutorialId: string | null) {
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setProgressMap(readStorage());
    sync();
    window.addEventListener("figma-edu-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("figma-edu-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const progress: TutorialProgress = mounted && tutorialId
    ? progressMap[tutorialId] ?? "not_started"
    : "not_started";

  const setProgress = useCallback(
    (value: TutorialProgress) => {
      if (!tutorialId) return;
      const next = { ...readStorage(), [tutorialId]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProgressMap(next);
      window.dispatchEvent(new CustomEvent("figma-edu-progress"));
    },
    [tutorialId]
  );

  const markWatched = useCallback(() => {
    if (!tutorialId) return;
    const current = readStorage()[tutorialId] ?? "not_started";
    if (current === "finished") return;
    setProgress("watched");
  }, [tutorialId, setProgress]);

  const markFinished = useCallback(() => {
    if (tutorialId) setProgress("finished");
  }, [tutorialId, setProgress]);

  return { progress, setProgress, markWatched, markFinished };
}

export function useAllProgress(): ProgressMap {
  const [map, setMap] = useState<ProgressMap>(() => readStorage());
  useEffect(() => {
    const sync = () => setMap(readStorage());
    sync();
    window.addEventListener("figma-edu-progress", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("figma-edu-progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return map;
}
