import { notFound } from "next/navigation";
import tutorialsData from "@/data/tutorials.json";
import type { Tutorial } from "@/types/tutorial";
import { TutorialPageClient } from "@/components/TutorialPageClient";

const tutorials = tutorialsData as Tutorial[];

export async function generateStaticParams() {
  return tutorials.map((t) => ({ id: t.id }));
}

function getTutorial(id: string): Tutorial | undefined {
  return tutorials.find((t) => t.id === id);
}

function getNextTutorialId(id: string): string | null {
  const index = tutorials.findIndex((t) => t.id === id);
  if (index === -1) return null;
  return tutorials[index + 1]?.id ?? null;
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutorial = getTutorial(id);
  if (!tutorial) notFound();

  const nextTutorialId = getNextTutorialId(id);
  return (
    <TutorialPageClient tutorial={tutorial} nextTutorialId={nextTutorialId} />
  );
}
