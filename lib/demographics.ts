import type { Demographics, Scores } from "@/lib/api";

export type Category = "race" | "age" | "gender";

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "race", label: "RACE" },
  { key: "age", label: "AGE" },
  { key: "gender", label: "SEX" },
];

export type Entry = { key: string; value: number };

// Scores as a list sorted highest-confidence first. Ties keep a stable
// alphabetical order so the UI doesn't jitter between renders.
export function sortedEntries(scores: Scores): Entry[] {
  return Object.entries(scores)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
}

// The single highest-confidence key — the AI's best guess for a category.
export function topKey(scores: Scores): string {
  return sortedEntries(scores)[0]?.key ?? "";
}

// 0.2525825 -> "25.25" (two decimal places, as required by the spec).
export function toPercent(value: number): string {
  return (value * 100).toFixed(2);
}

// Human-facing label for a score key, e.g. "southeast asian" -> "Southeast Asian".
export function titleCase(key: string): string {
  return key.replace(/\b\w/g, (c) => c.toUpperCase());
}

// The default selection when results first load: the AI's top pick per category.
export function defaultSelections(data: Demographics): Record<Category, string> {
  return {
    race: topKey(data.race),
    age: topKey(data.age),
    gender: topKey(data.gender),
  };
}
