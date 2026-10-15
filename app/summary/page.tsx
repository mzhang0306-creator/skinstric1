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

  // Center label: "20-29 y.o." for age, otherwise the title-cased value.
  const centerLabel =
    active === "age" ? `${selectedKey} y.o.` : titleCase(selectedKey);

  function choose(key: string) {
    setLoaded((prev) =>
      prev
        ? { ...prev, selections: { ...prev.selections, [active]: key } }
        : prev
    );
  }

  function reset() {
    setLoaded((prev) =>
      prev ? { ...prev, selections: defaultSelections(prev.data) } : prev
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <Header label="ANALYSIS" />

      <div className="px-4 pt-20 sm:px-8">
        <p className="text-[10px] font-semibold tracking-[0.1em] text-foreground">
          A. I. ANALYSIS
        </p>
        <h1 className="text-4xl font-normal leading-none tracking-tight sm:text-5xl md:text-7xl">
          DEMOGRAPHICS
        </h1>
        <p className="mt-2 text-[10px] font-semibold tracking-[0.1em] text-foreground/60">
          PREDICTED RACE &amp; AGE
        </p>
      </div>

      <div className="mt-6 grid flex-1 grid-cols-1 gap-px border-t border-foreground/15 px-4 sm:px-8 lg:grid-cols-[minmax(0,240px)_1fr_minmax(0,360px)] lg:gap-0">
        {/* Left: current selection per category */}
        <div className="flex flex-col border-foreground/15 lg:border-r">
          {CATEGORIES.map(({ key, label }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`flex flex-col justify-center border-b border-foreground/15 px-4 py-5 text-left transition-colors ${
                  isActive
                    ? "bg-foreground text-white"
                    : "bg-foreground/5 hover:bg-foreground/10"
                }`}
              >
                <span className="text-lg font-medium uppercase leading-tight">
                  {selections[key]}
                </span>
                <span
                  className={`text-xs tracking-wide ${
                    isActive ? "text-white/70" : "text-foreground/60"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center: the active selection as a thin confidence circle */}
        <div className="relative flex min-h-[320px] items-center justify-center">
          <span className="absolute left-2 top-4 text-2xl font-light md:text-4xl">
            {centerLabel}
          </span>
          <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-foreground/70 md:h-72 md:w-72">
            <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-foreground" />
            <span className="text-5xl font-light md:text-6xl">
              {selectedPct}
              <span className="align-super text-xl">%</span>
            </span>
          </div>
        </div>

        {/* Right: full list, descending, 2 decimals, click to override */}
        <div className="flex flex-col border-foreground/15 lg:border-l">
          <div className="flex justify-between border-b border-foreground/15 px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-foreground/60">
            <span>{CATEGORIES.find((c) => c.key === active)?.label}</span>
            <span>A. I. CONFIDENCE</span>
          </div>
          {entries.map(({ key, value }) => {
            const isSel = key === selectedKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => choose(key)}
                className={`flex w-full items-center justify-between border-b border-foreground/10 px-4 py-3 text-left text-sm transition-colors ${
                  isSel
                    ? "bg-foreground text-white"
                    : "hover:bg-foreground/5"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rotate-45 border ${
                      isSel ? "border-white bg-white" : "border-foreground"
                    }`}
                  />
                  {titleCase(key)}
                </span>
                <span className="tabular-nums">{toPercent(value)} %</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-4 px-4 py-6 sm:px-8">
        <button
          type="button"
          onClick={() => router.push("/select")}
          className="group flex items-center gap-3"
        >
          <span className="flex h-10 w-10 rotate-45 items-center justify-center border border-foreground transition-colors group-hover:bg-foreground">
            <FaAngleLeft className="-rotate-45 transition-colors group-hover:text-white" />
          </span>
          <span className="text-xs font-semibold tracking-wide">BACK</span>
        </button>

        <p className="hidden text-center text-xs text-foreground/50 sm:block">
          If A.I. estimate is wrong, select the correct one.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="border border-foreground px-6 py-3 text-[10px] font-semibold tracking-[0.1em] transition-colors hover:bg-foreground/5"
          >
            RESET
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-foreground px-6 py-3 text-[10px] font-semibold tracking-[0.1em] text-white"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </main>
  );
}
