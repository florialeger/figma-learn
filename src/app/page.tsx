import tutorialsData from "@/data/tutorials.json";
import type { Tutorial } from "@/types/tutorial";
import { HomeClient } from "@/components/HomeClient";

const tutorials = tutorialsData as Tutorial[];

export type FilterCategories = {
  objectives: string[];
  techniques: string[];
  typeDeSavoir: string[];
  durations: string[];
};

function getMinutesFromTime(time: string): number {
  const match = time.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function getDurationRange(minutes: number): string {
  if (minutes < 5) return "Moins de 5 min";
  if (minutes <= 10) return "5 - 10 min";
  if (minutes <= 15) return "10 - 15 min";
  if (minutes <= 20) return "15 - 20 min";
  return "Plus de 20 min";
}

function getCategorizedFilters(list: Tutorial[]): FilterCategories {
  const objectives = new Set<string>();
  const techniques = new Set<string>();
  const typeDeSavoir = new Set<string>();
  const durations = new Set<string>();

  list.forEach((t) => {
    if (t.meta.objective) objectives.add(t.meta.objective);
    t.meta.technique?.forEach((tech) => techniques.add(tech));
    if (t.meta.typeDeSavoir) typeDeSavoir.add(t.meta.typeDeSavoir);
    if (t.meta.time) {
      const minutes = getMinutesFromTime(t.meta.time);
      durations.add(getDurationRange(minutes));
    }
  });

  return {
    objectives: Array.from(objectives).sort(),
    techniques: Array.from(techniques).sort(),
    typeDeSavoir: Array.from(typeDeSavoir).sort(),
    durations: Array.from(durations).sort((a, b) => {
      const order = [
        "Moins de 5 min",
        "5 - 10 min",
        "10 - 15 min",
        "15 - 20 min",
        "Plus de 20 min",
      ];
      return order.indexOf(a) - order.indexOf(b);
    }),
  };
}

export default function HomePage() {
  const filterCategories = getCategorizedFilters(tutorials);

  return (
    <div className="mx-auto max-w-7xl px-8 py-8 md:py-12">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Les fondamentaux de Figma
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Apprends a utiliser Figma a travers des tutoriels pratiques. Tout ce
          que nous creerons sera fait dans les Design Files.
        </p>
      </header>

      <HomeClient tutorials={tutorials} filterCategories={filterCategories} />
    </div>
  );
}
