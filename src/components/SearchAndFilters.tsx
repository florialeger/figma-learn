"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FilterCategories } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "@/components/ui/check";
import { ChevronDownIcon } from "@/components/ui/chevron-down";
import { SearchIcon } from "@/components/ui/search";
import { XIcon } from "@/components/ui/x";

export type FilterState = {
  query: string;
  objective: string[];
  techniques: string[];
  typeDeSavoir: string[];
  duration: string[];
};

function MultiSelectFilterButton({
  label,
  options,
  selected,
  onToggle,
  onClear,
  onSelectAll,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  onSelectAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", onClickOutside);
    }

    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const hasSelection = selected.length > 0;

  return (
    <div className="relative z-40" ref={rootRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        className="pointer-events-auto h-9 w-fit shrink-0 justify-between whitespace-nowrap text-xs sm:text-sm"
      >
        {selected.length > 0 ? `${label} (${selected.length})` : label}
        <ChevronDownIcon size={16} className="text-current" />
      </Button>

      {open && (
        <div className="pointer-events-auto absolute left-0 top-11 z-50 w-56 rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
          <button
            type="button"
            className="mb-1 w-full rounded-sm px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent"
            onClick={hasSelection ? onClear : onSelectAll}
          >
            {hasSelection ? "Tout Deselectionner" : "Tout Selectionner"}
          </button>
          <div className="max-h-56 space-y-1 overflow-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggle(option)}
                  className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  <span>{option}</span>
                  {isSelected && (
                    <CheckIcon size={16} className="text-current" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchAndFilters({
  filterCategories,
  state,
  onChange,
}: {
  filterCategories: FilterCategories;
  state: FilterState;
  onChange: (s: FilterState) => void;
}) {
  const hasFilters =
    state.query.trim() !== "" ||
    state.objective.length > 0 ||
    state.techniques.length > 0 ||
    state.typeDeSavoir.length > 0 ||
    state.duration.length > 0;

  const selectedFilters = useMemo(
    () => [
      ...state.objective.map((objective) => ({
        key: `objective:${objective}`,
        label: objective,
        onRemove: () =>
          onChange({
            ...state,
            objective: state.objective.filter((item) => item !== objective),
          }),
      })),
      ...state.techniques.map((technique) => ({
        key: `technique:${technique}`,
        label: technique,
        onRemove: () =>
          onChange({
            ...state,
            techniques: state.techniques.filter((item) => item !== technique),
          }),
      })),
      ...state.typeDeSavoir.map((type) => ({
        key: `type:${type}`,
        label: type,
        onRemove: () =>
          onChange({
            ...state,
            typeDeSavoir: state.typeDeSavoir.filter((item) => item !== type),
          }),
      })),
      ...state.duration.map((duration) => ({
        key: `duration:${duration}`,
        label: duration,
        onRemove: () =>
          onChange({
            ...state,
            duration: state.duration.filter((item) => item !== duration),
          }),
      })),
    ],
    [onChange, state],
  );

  const clearFilters = () => {
    onChange({
      query: "",
      objective: [],
      techniques: [],
      typeDeSavoir: [],
      duration: [],
    });
  };

  return (
    <div className="relative z-30 space-y-4 rounded-2xl border bg-card p-2 text-card-foreground">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:max-w-xs lg:flex-1">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-9"
            type="search"
            value={state.query}
            onChange={(e) => onChange({ ...state, query: e.target.value })}
            placeholder="Rechercher un concept..."
            aria-label="Recherche"
          />
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2 lg:ml-auto">
          <MultiSelectFilterButton
            label="Mon objectif"
            options={filterCategories.objectives}
            selected={state.objective}
            onClear={() => onChange({ ...state, objective: [] })}
            onSelectAll={() =>
              onChange({ ...state, objective: filterCategories.objectives })
            }
            onToggle={(option) =>
              onChange({
                ...state,
                objective: state.objective.includes(option)
                  ? state.objective.filter((item) => item !== option)
                  : [...state.objective, option],
              })
            }
          />

          <MultiSelectFilterButton
            label="Technique"
            options={filterCategories.techniques}
            selected={state.techniques}
            onClear={() => onChange({ ...state, techniques: [] })}
            onSelectAll={() =>
              onChange({ ...state, techniques: filterCategories.techniques })
            }
            onToggle={(option) =>
              onChange({
                ...state,
                techniques: state.techniques.includes(option)
                  ? state.techniques.filter((item) => item !== option)
                  : [...state.techniques, option],
              })
            }
          />

          <MultiSelectFilterButton
            label="Type de savoir"
            options={filterCategories.typeDeSavoir}
            selected={state.typeDeSavoir}
            onClear={() => onChange({ ...state, typeDeSavoir: [] })}
            onSelectAll={() =>
              onChange({
                ...state,
                typeDeSavoir: filterCategories.typeDeSavoir,
              })
            }
            onToggle={(option) =>
              onChange({
                ...state,
                typeDeSavoir: state.typeDeSavoir.includes(option)
                  ? state.typeDeSavoir.filter((item) => item !== option)
                  : [...state.typeDeSavoir, option],
              })
            }
          />

          <MultiSelectFilterButton
            label="Duree"
            options={filterCategories.durations}
            selected={state.duration}
            onClear={() => onChange({ ...state, duration: [] })}
            onSelectAll={() =>
              onChange({ ...state, duration: filterCategories.durations })
            }
            onToggle={(option) =>
              onChange({
                ...state,
                duration: state.duration.includes(option)
                  ? state.duration.filter((item) => item !== option)
                  : [...state.duration, option],
              })
            }
          />
        </div>
      </div>

      {(hasFilters || selectedFilters.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedFilters.map((filter) => (
            <Button
              key={filter.key}
              variant="secondary"
              size="sm"
              onClick={filter.onRemove}
              className="h-8"
            >
              <XIcon size={14} className="text-current" />
              {filter.label}
            </Button>
          ))}

          {hasFilters && (
            <div className="ml-auto">
              <Button
                variant="destructive"
                size="sm"
                onClick={clearFilters}
                className="h-8"
              >
                <XIcon size={16} className="text-current" />
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
