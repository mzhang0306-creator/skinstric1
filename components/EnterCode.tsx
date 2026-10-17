"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeCode, restoreByCode } from "@/lib/codes";

// The header "ENTER CODE" action: opens a modal to revisit a saved analysis
// by its code (same-browser, stored in localStorage).
export default function EnterCode() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setCode("");
        setError("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setCode("");
    setError("");
  }

  function submit() {
    const c = normalizeCode(code);
    if (!c) {
      setError("Enter a code.");
      return;
    }
    if (restoreByCode(c)) {
      close();
      router.push("/summary");
    } else {
      setError("No result found for that code.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-foreground px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-white"
      >
        ENTER CODE
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enter your code"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={close}
        >
          <div
            className="w-full max-w-sm border border-foreground/10 bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-foreground/60">
              ENTER YOUR CODE
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              Revisit a saved analysis from this browser.
            </p>

            <input
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="E.G. K7P2QF"
              maxLength={8}
              className="mt-5 w-full border-b border-foreground bg-transparent pb-2 text-center text-2xl font-light tracking-[0.3em] outline-none placeholder:text-foreground/30"
            />
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="border border-foreground px-5 py-2 text-[10px] font-semibold tracking-[0.15em]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={submit}
                className="bg-foreground px-5 py-2 text-[10px] font-semibold tracking-[0.15em] text-white"
              >
                REVISIT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
