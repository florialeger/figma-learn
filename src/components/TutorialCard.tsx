"use client";

import Image from "next/image";
import Link from "next/link";
import type { Tutorial } from "@/types/tutorial";
import { useTutorialProgress } from "@/hooks/useTutorialProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "@/components/ui/check";
import { ClockIcon } from "@/components/ui/clock";
import { EyeIcon } from "@/components/ui/eye";

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const { progress } = useTutorialProgress(tutorial.id);
  const { meta, title, description } = tutorial;

  return (
    <Link href={`/tuto/${tutorial.id}`} className="block">
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={meta.thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 900px) 100vw, 33vw"
            unoptimized={meta.thumbnailUrl.startsWith("http")}
          />
        </div>

        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ClockIcon size={14} className="text-current" />
              {meta.time}
            </span>
            {progress === "finished" && (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <CheckIcon size={14} className="text-current" />
                Fini
              </span>
            )}
            {progress === "watched" && (
              <span className="inline-flex items-center gap-1 text-amber-600">
                <EyeIcon size={14} className="text-current" />
                Vu
              </span>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        </CardHeader>

        <CardContent className="pb-4 text-sm text-muted-foreground">
          <p className="line-clamp-3">{description.short}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
