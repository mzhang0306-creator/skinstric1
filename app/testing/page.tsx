"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Header from "@/components/Header";
import RotatingDiamonds from "@/components/RotatingDiamonds";
import { submitPhaseOne } from "@/lib/api";

type Step = "name" | "location";

// Letters, spaces and simple punctuation only — no numbers or broken values.
const VALID = /^[a-zA-Z][a-zA-Z\s'.-]*$/;

export default function TestingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Restore anything already captured this session. localStorage is only
  // available post-mount, so this hydration read belongs in an effect.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setName(localStorage.getItem("skinstric:name") ?? "");
    setLocation(localStorage.getItem("skinstric:location") ?? "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const value = step === "name" ? name : location;
  const setValue = step === "name" ? setName : setLocation;

  function validate(v: string) {
    if (!v.trim()) return "Please enter a value to continue.";
    if (!VALID.test(v.trim())) return "Letters only — no numbers or symbols.";
    return "";
  }

  async function proceed() {
    const err = validate(value);
    if (err) {
      setError(err);
      return;
    }
    setError("");

    if (step === "name") {
      localStorage.setItem("skinstric:name", name.trim());
      setStep("location");
      return;
    }

    localStorage.setItem("skinstric:location", location.trim());
    setSubmitting(true);
    try {
      await submitPhaseOne(name.trim(), location.trim());
      router.push("/select");
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function back() {
    setError("");
    if (step === "location") setStep("name");
    else router.push("/");
  }

  return (
    <main className="relative h-screen overflow-hidden">
      <Header label="INTRO" />
      <p className="absolute left-4 top-20 text-[10px] font-semibold tracking-[0.2em] text-foreground/60 sm:left-8">
        TO START ANALYSIS
      </p>

      <div className="relative flex h-full items-center justify-center">
        <RotatingDiamonds />
        <div className="relative z-10 text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-foreground/50">
            CLICK TO TYPE
          </p>
          <input
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") proceed();
            }}
            placeholder={step === "name" ? "Introduce Yourself" : "Where are you from?"}
            className="w-[340px] max-w-[80vw] border-b border-foreground bg-transparent pb-2 text-center text-3xl font-light tracking-tight outline-none placeholder:text-foreground/40 md:text-5xl"
          />
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={back}
        className="group absolute bottom-8 left-4 flex items-center gap-3 sm:left-8"
      >
        <span className="flex h-10 w-10 rotate-45 items-center justify-center border border-foreground transition-colors group-hover:bg-foreground">
          <FaAngleLeft className="-rotate-45 transition-colors group-hover:text-white" />
        </span>
        <span className="text-xs font-semibold tracking-wide">BACK</span>
      </button>

      <button
        type="button"
        onClick={proceed}
        disabled={submitting}
        className="group absolute bottom-8 right-4 flex items-center gap-3 disabled:opacity-50 sm:right-8"
      >
        <span className="text-xs font-semibold tracking-wide">
          {submitting ? "SENDING…" : "PROCEED"}
        </span>
        <span className="flex h-10 w-10 rotate-45 items-center justify-center border border-foreground transition-colors group-hover:bg-foreground">
          <FaAngleRight className="-rotate-45 transition-colors group-hover:text-white" />
        </span>
      </button>
    </main>
  );
}
