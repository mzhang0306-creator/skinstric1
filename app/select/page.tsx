"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import Header from "@/components/Header";
import RotatingDiamonds from "@/components/RotatingDiamonds";
import { submitPhaseTwo } from "@/lib/api";

// Read a File into a base64 data URL the API can consume.
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

export default function SelectPage() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setError("");
    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const data = await submitPhaseTwo(dataUrl);
      localStorage.setItem("skinstric:demographics", JSON.stringify(data));
      router.push("/summary");
    } catch {
      setError("Something went wrong analyzing that image. Please try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="relative h-screen overflow-hidden">
        <Header label="ANALYSIS" />
        <div className="relative flex h-full items-center justify-center">
          <RotatingDiamonds />
          <p className="relative z-10 text-sm font-medium tracking-[0.1em] text-foreground">
            PREPARING YOUR ANALYSIS...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-screen overflow-hidden">
      <Header label="INTRO" />

      <p className="absolute left-4 top-20 text-[10px] font-semibold tracking-[0.1em] text-foreground sm:left-8">
        TO START ANALYSIS
      </p>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />

      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-16 sm:flex-row sm:gap-0">
          <DiamondOption
            icon="/icons/shutter.svg"
            lines={["ALLOW A.I.", "TO SCAN YOUR FACE"]}
            labelSide="top"
            onClick={() => router.push("/select/camera")}
          />
          <DiamondOption
            icon="/icons/gallery.svg"
            lines={["ALLOW A.I.", "ACCESS GALLERY"]}
            labelSide="bottom"
            onClick={() => fileInput.current?.click()}
          />
        </div>
      </div>

      {error && (
        <p className="absolute inset-x-0 bottom-24 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => router.push("/testing")}
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

// A camera/gallery choice: an icon framed by the dotted "rombuses" motif,
// with a thin connector line out to its label (per the Figma).
function DiamondOption({
  icon,
  lines,
  labelSide,
  onClick,
}: {
  icon: string;
  lines: string[];
  labelSide: "top" | "bottom";
  onClick: () => void;
}) {
  const top = labelSide === "top";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative grid h-[280px] w-[280px] place-items-center sm:h-[340px] sm:w-[340px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/rombuses.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon}
        alt=""
        aria-hidden
        className="relative h-12 w-12 transition-transform duration-300 group-hover:scale-110"
      />

      {/* connector line + label */}
      <span
        className={`absolute flex items-center gap-2 ${
          top
            ? "left-[58%] top-[30%] flex-row"
            : "right-[58%] bottom-[30%] flex-row-reverse"
        }`}
      >
        <span className="h-px w-10 bg-foreground/50" />
        <span
          className={`text-[11px] leading-tight tracking-[0.05em] text-foreground/80 ${
            top ? "text-left" : "text-right"
          }`}
        >
          {lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
