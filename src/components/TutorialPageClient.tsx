"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Tutorial, TutorialStep } from "@/types/tutorial";
import { useTutorialProgress } from "@/hooks/useTutorialProgress";
import { SafeHtml } from "@/lib/safe-html";
import { DopamineButton } from "@/components/DopamineButton";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeftIcon } from "./ui/arrow-left";
import { DownloadIcon } from "./ui/download";
import { CopyIcon } from "./ui/copy";
import { CheckIcon, type CheckIconHandle } from "./ui/check";
import { CircleHelpIcon } from "./ui/circle-help";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Kbd } from "./ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { MinimalVideoPlayer } from "./MinimalVideoPlayer";

function getMediaType(url: string): "image" | "video" {
  const ext = url.split(".").pop()?.toLowerCase() || "";
  const videoExts = ["mp4", "webm", "ogg", "mov", "avi"];
  return videoExts.includes(ext) ? "video" : "image";
}

function MediaPlayer({ src, alt = "" }: { src: string; alt?: string }) {
  const mediaType = getMediaType(src);

  if (mediaType === "video") {
    return <MinimalVideoPlayer src={src} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full rounded-sm object-cover"
    />
  );
}

async function copyTextToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

function downloadAssets(
  assets: Array<{ name: string; url: string }> | undefined,
) {
  (assets ?? []).forEach((asset) => {
    if (asset.url.startsWith("#")) return;
    const link = document.createElement("a");
    link.href = asset.url;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

export function TutorialPageClient({
  tutorial,
  nextTutorialId,
}: {
  tutorial: Tutorial;
  nextTutorialId: string | null;
}) {
  const { markWatched } = useTutorialProgress(tutorial.id);
  const [activeStepId, setActiveStepId] = useState(1);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const topCheckIconRef = useRef<CheckIconHandle | null>(null);
  const stepRefs = useRef<Record<number, HTMLElement | null>>({});
  const downloadableAssets = tutorial.steps.flatMap((step) =>
    (step.assets ?? []).filter((asset) => !asset.url.startsWith("#")),
  );

  const copyLink = async () => {
    await copyTextToClipboard(window.location.href);
    setIsLinkCopied(true);
    window.setTimeout(() => setIsLinkCopied(false), 1200);
  };

  useEffect(() => {
    markWatched();
  }, [markWatched]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = Number(entry.target.getAttribute("data-step-id"));
          if (!Number.isNaN(id)) setActiveStepId(id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    tutorial.steps.forEach((step) => {
      const el = stepRefs.current[step.stepId];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tutorial.steps]);

  useEffect(() => {
    if (isLinkCopied) {
      topCheckIconRef.current?.startAnimation();
    }
  }, [isLinkCopied]);

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <div className="fixed top-2 left-4 space-y-5">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeftIcon size={16} className="text-current" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <ScrollArea className="h-[calc(100vh-150px)] rounded-md border">
            <div className="space-y-2 p-3">
              <p className="text-sm font-semibold">Étapes</p>
              <ul className="space-y-1">
                {tutorial.steps.map((step) => (
                  <li key={step.stepId}>
                    <a
                      href={`#step-${step.stepId}`}
                      className={`block rounded-sm px-2 py-1.5 text-sm ${
                        activeStepId === step.stepId
                          ? "bg-muted font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {step.stepId}. {step.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </div>
      </aside>

      <div className="space-y-24">
        <div className="lg:hidden">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeftIcon size={16} className="text-current" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>{tutorial.meta.time}</span>
            <span>{tutorial.meta.level}</span>
          </div>

          <h1 className="text-2xl font-semibold md:text-3xl">
            {tutorial.title}
          </h1>
          <SafeHtml
            html={tutorial.description.long}
            className="text-sm leading-relaxed text-muted-foreground [&_b]:font-semibold"
          />

          {(tutorial.meta.technique?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {tutorial.meta.technique?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-2">
          <div className="flex items-center gap-2">
            {downloadableAssets.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => downloadAssets(downloadableAssets)}
              >
                <DownloadIcon size={16} className="text-current" />
                Télécharger tous les assets
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={copyLink}
              title="Copier le lien"
            >
              {isLinkCopied ? (
                <CheckIcon
                  ref={topCheckIconRef}
                  size={16}
                  className="text-emerald-600"
                />
              ) : (
                <CopyIcon size={16} className="text-current" />
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  title="Afficher les raccourcis"
                >
                  <CircleHelpIcon size={16} className="text-current" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Raccourcis essentiels Figma
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Les commandes les plus utiles pour avancer vite.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span>Auto Layout</span>
                    <Kbd>Shift + A</Kbd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Frame tool</span>
                    <Kbd>F</Kbd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Text tool</span>
                    <Kbd>T</Kbd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Align center horizontal</span>
                    <Kbd>Alt + H</Kbd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Align bottom</span>
                    <Kbd>Alt + S</Kbd>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogAction>Compris</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-16">
          {tutorial.steps.map((step) => (
            <StepBlock
              key={step.stepId}
              step={step}
              onDownloadStepAssets={() => downloadAssets(step.assets)}
              setRef={(el) => {
                stepRefs.current[step.stepId] = el;
              }}
            />
          ))}
        </div>

        <div className="rounded-sm border bg-card p-4">
          <DopamineButton
            tutorialId={tutorial.id}
            nextTutorialId={nextTutorialId}
          />
        </div>
      </div>
    </div>
  );
}

function StepBlock({
  step,
  onDownloadStepAssets,
  setRef,
}: {
  step: TutorialStep;
  onDownloadStepAssets: () => void;
  setRef: (el: HTMLElement | null) => void;
}) {
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const copiedInlineTimeoutRef = useRef<number | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState("Cliquer pour copier");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const hasDownloadableStepAssets = (step.assets ?? []).some(
    (asset) => !asset.url.startsWith("#"),
  );

  const updateTooltipForCodeElement = (codeElement: HTMLElement) => {
    const descriptionElement = descriptionRef.current;
    if (!descriptionElement) return;

    const codeRect = codeElement.getBoundingClientRect();
    const descriptionRect = descriptionElement.getBoundingClientRect();

    setTooltipPos({
      x: codeRect.left - descriptionRect.left + codeRect.width / 2,
      y: codeRect.bottom - descriptionRect.top - 8,
    });
  };

  const handleDescriptionMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;
    const codeElement = target.closest("code") as HTMLElement | null;

    if (!codeElement) {
      setTooltipOpen(false);
      setTooltipLabel("Cliquer pour copier");
      return;
    }

    updateTooltipForCodeElement(codeElement);
    setTooltipOpen(true);
  };

  const handleDescriptionMouseLeave = () => {
    setTooltipOpen(false);
    setTooltipLabel("Cliquer pour copier");
  };

  const handleDescriptionClick = async (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;
    const codeElement = target.closest("code") as HTMLElement | null;

    if (!codeElement) return;

    const value = codeElement.textContent?.trim();
    if (!value) return;

    await copyTextToClipboard(value);
    updateTooltipForCodeElement(codeElement);
    setTooltipOpen(true);
    setTooltipLabel("Copié");

    if (copiedInlineTimeoutRef.current) {
      window.clearTimeout(copiedInlineTimeoutRef.current);
    }

    copiedInlineTimeoutRef.current = window.setTimeout(() => {
      setTooltipLabel("Cliquer pour copier");
      copiedInlineTimeoutRef.current = null;
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (copiedInlineTimeoutRef.current) {
        window.clearTimeout(copiedInlineTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={setRef}
      id={`step-${step.stepId}`}
      data-step-id={step.stepId}
      className="scroll-mt-24"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            {hasDownloadableStepAssets && (
              <TooltipProvider delayDuration={120}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={onDownloadStepAssets}
                      aria-label="Télécharger les assets de cette étape"
                    >
                      <DownloadIcon size={16} className="text-current" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8}>
                    Télécharger les assets de cette étape
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="relative py-1" ref={descriptionRef}>
            <TooltipProvider delayDuration={120}>
              <Tooltip open={tooltipOpen}>
                <TooltipTrigger asChild>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute h-px w-px"
                    style={{
                      left: `${tooltipPos.x}px`,
                      top: `${tooltipPos.y}px`,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  {tooltipLabel}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div
              onClick={handleDescriptionClick}
              onMouseMove={handleDescriptionMouseMove}
              onMouseLeave={handleDescriptionMouseLeave}
            >
              <SafeHtml
                html={step.description}
                className="text-sm leading-relaxed text-muted-foreground [&_b]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_kbd]:inline-flex [&_kbd]:h-6 [&_kbd]:items-center [&_kbd]:gap-1 [&_kbd]:rounded [&_kbd]:border [&_kbd]:border-border [&_kbd]:bg-muted [&_kbd]:px-1.5 [&_kbd]:text-[0.875em] [&_kbd]:font-medium [&_kbd]:text-muted-foreground [&_kbd]:align-middle"
                data-safe-html
              />
            </div>
          </div>
        </div>

        {step.videoUrl && (
          <div className="aspect-video overflow-hidden rounded-sm bg-muted">
            <MediaPlayer src={step.videoUrl} />
          </div>
        )}

        {step.tip && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-2">
              <div className="flex items-start gap-2.5 text-amber-900">
                <CircleHelpIcon size={20} className="shrink-0 text-amber-700" />
                <SafeHtml
                  html={step.tip}
                  className="text-sm leading-relaxed [&_b]:font-semibold"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
