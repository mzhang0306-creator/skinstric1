"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaCamera, FaRegImage } from "react-icons/fa6";
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
          <p className="relative z-10 text-xs tracking-[0.3em] text-foreground/60">
            PREPARING YOUR ANALYSIS
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-screen overflow-hidden">
      <Header label="ANALYSIS" />

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />

      <div className="flex h-full flex-col items-center justify-center gap-10 px-6 text-center">
        <div>
          <p className="text-xs tracking-[0.3em] text-foreground/50">
            TO START ANALYSIS
          </p>
          <h1 className="mt-2 text-2xl font-light tracking-tight md:text-4xl">
            How would you like to begin?
          </h1>
        </div>

        <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
          <Tile
            icon={<FaCamera className="text-xl" />}
            title="Allow A.I. to scan your face"
            caption="TAKE A SELFIE"
            onClick={() => router.push("/select/camera")}
          />
          <Tile
            icon={<FaRegImage className="text-xl" />}
            title="Allow A.I. access to gallery"
            caption="UPLOAD A PHOTO"
            onClick={() => fileInput.current?.click()}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

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

function Tile({
  icon,
  title,
  caption,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-4"
    >
      <span className="flex h-40 w-40 rotate-45 items-center justify-center border border-dotted border-foreground/30 transition-colors group-hover:border-foreground">
        <span className="-rotate-45 text-foreground/70 transition-colors group-hover:text-foreground">
          {icon}
        </span>
      </span>
      <span className="max-w-[12rem] text-sm text-foreground/70">{title}</span>
      <span className="text-[10px] font-semibold tracking-[0.2em] text-foreground/50">
        {caption}
      </span>
    </button>
  );
}
