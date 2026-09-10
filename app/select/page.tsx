"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

// Placeholder for Phase 2/3 (upload image / take a selfie). Built next.
export default function SelectPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("skinstric:name") ?? "");
  }, []);

  return (
    <main className="relative h-screen overflow-hidden">
      <Header label="ANALYSIS" />
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-xs tracking-[0.3em] text-foreground/50">
          A. I. ANALYSIS
        </p>
        <h1 className="text-4xl font-light tracking-tight md:text-6xl">
          {name ? `Thanks, ${name}.` : "Thank you."}
        </h1>
        <p className="max-w-md text-sm text-foreground/60">
          Image upload and selfie capture (Phases 2 &amp; 3) are coming next.
        </p>
      </div>
    </main>
  );
}
