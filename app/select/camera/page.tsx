"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaCamera, FaArrowRotateLeft } from "react-icons/fa6";
import Header from "@/components/Header";
import RotatingDiamonds from "@/components/RotatingDiamonds";
import { submitPhaseTwo } from "@/lib/api";

type Phase = "live" | "preview" | "analyzing";

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>("live");
  const [shot, setShot] = useState<string>(""); // captured data URL
  const [error, setError] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setError(
        "Camera access was blocked. Enable it in your browser, or go back and upload a photo instead."
      );
    }
  }, []);

  // Start the camera on mount; always release it on unmount. startStream only
  // sets state from its async catch block (external-system sync, not a render loop).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (phase === "live") startStream();
    return stopStream;
  }, [phase, startStream, stopStream]);

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    setShot(canvas.toDataURL("image/jpeg", 0.9));
    stopStream();
    setPhase("preview");
  }

  function retake() {
    setError("");
    setShot("");
    setPhase("live");
  }

  async function analyze() {
    setPhase("analyzing");
    try {
      const data = await submitPhaseTwo(shot);
      localStorage.setItem("skinstric:demographics", JSON.stringify(data));
      router.push("/summary");
    } catch {
      setError("Analysis failed. Please retake the photo and try again.");
      setPhase("preview");
    }
  }

  if (phase === "analyzing") {
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

      <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
        <p className="text-xs tracking-[0.3em] text-foreground/50">
          {phase === "live" ? "CENTER YOUR FACE" : "USE THIS PHOTO?"}
        </p>

        <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden border border-foreground/20 bg-black/90">
          {phase === "preview" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shot} alt="Your selfie" className="h-full w-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full -scale-x-100 object-cover"
            />
          )}
        </div>

        {error && (
          <p className="max-w-md text-center text-sm text-red-600">{error}</p>
        )}

        {phase === "live" ? (
          <button
            type="button"
            onClick={capture}
            disabled={!!error}
            className="flex items-center gap-3 bg-foreground px-6 py-3 text-xs font-semibold tracking-[0.15em] text-white disabled:opacity-40"
          >
            <FaCamera /> TAKE PHOTO
          </button>
        ) : null}

        {phase === "live" && (
          <div className="mt-2 text-center">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-foreground/60">
              TO GET BETTER RESULTS MAKE SURE TO HAVE
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[10px] tracking-[0.1em] text-foreground/70">
              <span>◇ NEUTRAL EXPRESSION</span>
              <span>◇ FRONTAL POSE</span>
              <span>◇ ADEQUATE LIGHTING</span>
            </div>
          </div>
        )}

        {phase === "preview" && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={retake}
              className="flex items-center gap-2 border border-foreground px-5 py-3 text-xs font-semibold tracking-[0.15em]"
            >
              <FaArrowRotateLeft /> RETAKE
            </button>
            <button
              type="button"
              onClick={analyze}
              className="bg-foreground px-6 py-3 text-xs font-semibold tracking-[0.15em] text-white"
            >
              USE PHOTO
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          stopStream();
          router.push("/select");
        }}
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
