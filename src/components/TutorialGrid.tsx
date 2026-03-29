"use client";

import type { Tutorial } from "@/types/tutorial";
import { TutorialCard } from "./TutorialCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TutorialGrid({ tutorials }: { tutorials: Tutorial[] }) {
  return (
    <section id="tutorials" className="py-8 md:py-12">
      {tutorials.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun tutoriel trouve</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ajustez vos filtres pour afficher des resultats.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((t) => (
            <TutorialCard key={t.id} tutorial={t} />
          ))}
        </div>
      )}
    </section>
  );
}
