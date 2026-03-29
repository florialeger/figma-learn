"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useTutorialProgress } from "@/hooks/useTutorialProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/arrow-left";
import { RefreshCCWIcon } from "@/components/ui/refresh-ccw";

export function DopamineButton({
  tutorialId,
  nextTutorialId,
}: {
  tutorialId: string;
  nextTutorialId: string | null;
}) {
  const router = useRouter();
  const { progress, markFinished, setProgress } =
    useTutorialProgress(tutorialId);
  const [showPostActions, setShowPostActions] = useState(
    progress === "finished",
  );

  useEffect(() => {
    setShowPostActions(progress === "finished");
  }, [progress]);

  const handleComplete = () => {
    if (progress === "finished") {
      router.push("/");
      return;
    }

    markFinished();
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.8 } });

    setShowPostActions(false);
    window.setTimeout(() => setShowPostActions(true), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button type="button" variant="secondary" onClick={handleComplete}>
        {progress === "finished" ? (
          <>
            <ArrowLeftIcon size={16} className="text-current" />
            Retour aux tutoriels
          </>
        ) : (
          "Marquer ce tutoriel comme termine !"
        )}
      </Button>

      {progress === "finished" && showPostActions && (
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {nextTutorialId && (
              <Button
                asChild
                type="button"
                className="bg-[#0d99ff] text-white hover:bg-[#0b89e6]"
              >
                <Link href={`/tuto/${nextTutorialId}`}>
                  Faire le prochain tutoriel
                </Link>
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setProgress("not_started")}
            className="text-muted-foreground"
          >
            <RefreshCCWIcon size={16} className="text-current" />
            Je veux refaire ce tuto ! Marquer comme non lu.
          </Button>
        </div>
      )}
    </div>
  );
}
