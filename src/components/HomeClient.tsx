"use client";

import { useMemo, useState } from "react";
import type { Tutorial } from "@/types/tutorial";
import { SearchAndFilters, type FilterState } from "./SearchAndFilters";
import { TutorialGrid } from "./TutorialGrid";
import type { FilterCategories } from "@/app/page";

export function HomeClient({
  tutorials,
  filterCategories,
}: {
  tutorials: Tutorial[];
  filterCategories: FilterCategories;
}) {
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

  const [filter, setFilter] = useState<FilterState>({
    query: "",
    objective: [],
    techniques: [],
    typeDeSavoir: [],
    duration: [],
  });

  const filtered = useMemo(() => {
    let list = tutorials;
    const q = filter.query.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.short.toLowerCase().includes(q) ||
          t.meta.technique?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    if (filter.objective.length > 0) {
      list = list.filter(
        (t) =>
          !!t.meta.objective && filter.objective.includes(t.meta.objective),
      );
    }

    if (filter.techniques.length > 0) {
      list = list.filter((t) =>
        filter.techniques.some((tech) => t.meta.technique?.includes(tech)),
      );
    }

    if (filter.typeDeSavoir.length > 0) {
      list = list.filter(
        (t) =>
          !!t.meta.typeDeSavoir &&
          filter.typeDeSavoir.includes(t.meta.typeDeSavoir),
      );
    }

    if (filter.duration.length > 0) {
      list = list.filter((t) => {
        const minutes = getMinutesFromTime(t.meta.time);
        const range = getDurationRange(minutes);
        return filter.duration.includes(range);
      });
    }

    return list;
  }, [tutorials, filter]);

  return (
    <>
      <div className="mb-8 md:mb-10">
        <SearchAndFilters
          filterCategories={filterCategories}
          state={filter}
          onChange={setFilter}
        />
      </div>
      <TutorialGrid tutorials={filtered} />
    </>
  );
}
