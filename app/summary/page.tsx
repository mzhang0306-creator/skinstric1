"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import Header from "@/components/Header";
import type { Demographics } from "@/lib/api";
import {
  CATEGORIES,
  Category,
  defaultSelections,
  sortedEntries,
  titleCase,
  toPercent,
} from "@/lib/demographics";

type Loaded = { data: Demographics; selections: Record<Category, string> };

export default function SummaryPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [active, setActive] = useState<Category>("race");

  // Load the analysis saved by the upload/selfie flow. No data -> go choose a source.
  useEffect(() => {
    const raw = localStorage.getItem("skinstric:demographics");
    if (!raw) {
      router.replace("/select");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Demographics;
      // One-time hydration read: localStorage is only available post-mount,
      // so this must happen in an effect rather than a lazy initializer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded({ data: parsed, selections: defaultSelections(parsed) });
    } catch {
      router.replace("/select");
    }
  }, [router]);

  const data = loaded?.data ?? null;
  const entries = useMemo(
    () => (data ? sortedEntries(data[active]) : []),
    [data, active]
  );

  if (!loaded) return null;
  const { data: dataLoaded, selections } = loaded;

  const selectedKey = selections[active];
  const selectedPct = toPercent(dataLoaded[active][selectedKey] ?? 0);

  function choose(key: string) {
    setLoaded((prev) =>
      prev
        ? { ...prev, selections: { ...prev.selections, [active]: key } }
        : prev
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <Header label="ANALYSIS" />

      <div className="px-4 pt-24 sm:px-8">
        <p className="text-xs tracking-[0.3em] text-foreground/50">A. I. ANALYSIS</p>
        <h1 className="mt-1 text-2xl font-light tracking-tight md:text-3xl">
          Predicted demographics
        </h1>
        <p className="mt-2 max-w-xl text-sm text-foreground/60">
          If a prediction looks wrong, click the correct value on the right to
          update it.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 px-4 sm:px-8 lg:grid-cols-[220px_1fr_320px]">
        {/* Left: current selection per category */}
        <div className="flex flex-col divide-y divide-foreground/15 border-y border-foreground/15">
          {CATEGORIES.map(({ key, label }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`flex items-baseline justify-between px-4 py-5 text-left transition-colors ${
                  isActive ? "bg-foreground text-white" : "hover:bg-foreground/5"
                }`}
              >
                <span className="text-lg font-light">
                  {titleCase(selections[key])}
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-[0.2em] ${
                    isActive ? "text-white/70" : "text-foreground/50"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center: the active selection as a confidence ring */}
        <div className="flex items-center justify-center py-6">
          <div
            className="relative flex h-56 w-56 items-center justify-center rounded-full md:h-64 md:w-64"
            style={{
              background: `conic-gradient(var(--foreground) ${selectedPct}%, color-mix(in srgb, var(--foreground) 12%, transparent) 0)`,
            }}
          >
            <div className="flex h-[88%] w-[88%] flex-col items-center justify-center rounded-full bg-background text-center">
              <span className="text-3xl font-light md:text-4xl">
                {selectedPct}
                <span className="text-xl">%</span>
              </span>
              <span className="mt-1 max-w-[70%] text-sm text-foreground/60">
                {titleCase(selectedKey)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: full list, descending, 2 decimals, click to override */}
        <div className="flex flex-col border-y border-foreground/15">
          <div className="flex justify-between px-4 py-3 text-[10px] font-semibold tracking-[0.2em] text-foreground/50">
            <span>{CATEGORIES.find((c) => c.key === active)?.label}</span>
            <span>A. I. CONFIDENCE</span>
          </div>
          <div className="divide-y divide-foreground/10">
            {entries.map(({ key, value }) => {
              const isSel = key === selectedKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => choose(key)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-foreground/5 ${
                    isSel ? "font-medium" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-3 w-3 items-center justify-center rounded-full border border-foreground ${
                        isSel ? "bg-foreground" : ""
                      }`}
                    />
                    {titleCase(key)}
                  </span>
                  <span className="tabular-nums text-foreground/70">
                    {toPercent(value)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/select")}
        className="group absolute bottom-8 left-4 flex items-center gap-3 sm:left-8"
      >
        <span className="flex h-10 w-10 rotate-45 items-center justify-center border border-foreground transition-colors group-hover:bg-foreground">
          <FaAngleLeft className="-rotate-45 transition-colors group-hover:text-white" />
        </span>
        <span className="text-xs font-semibold tracking-wide">BACK</span>
      </button>
    </main>
  );
}
